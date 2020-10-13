({
  

  DATA: [],
  
  setColumns: function(component) {
    let columns = [      
      { label: 'Name', fieldName: 'Name', type: 'button', sortable: true, typeAttributes: { label: { fieldName: 'Name' }, name: 'detail', title: { fieldName: 'Name' } } },
      { label: 'Subject', fieldName: 'Subject', type: 'text', cellAttributes: { alignment: 'left' } },
      { label: 'Date', fieldName: 'CreatedDate', type: 'date', cellAttributes: { alignment: 'left' }, typeAttributes: { year: "numeric", month: "numeric", day: "numeric" } },
      { label: 'Detail', fieldName: 'Info', type: 'button', initialWidth: 60, cellAttributes: { alignment: 'center' }, typeAttributes: { label: 'Info', name: 'info', title: { fieldName: 'Id' } } }      
    ];
    component.set('v.columns', columns);
  },

  sortBy: function(field, reverse, primer) {
      var key = primer
          ? function(x) {
                return primer(x[field]);
            }
          : function(x) {
                return x[field];
            };

      return function(a, b) {
          a = key(a);
          b = key(b);
          return reverse * ((a > b) - (b > a));
      };
  },

  handleSort: function(component, event) {
      var sortedBy = event.getParam('fieldName');
      var sortDirection = event.getParam('sortDirection');

      var cloneData = this.DATA.slice(0);
      cloneData.sort((this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1)));
      
      component.set('v.data', cloneData);
      component.set('v.sortDirection', sortDirection);
      component.set('v.sortedBy', sortedBy);
  },

  initData: function (cmp,  event, numberOfRecords) {
    let actionTotalLead = cmp.get("c.getTotalEmails");    
    actionTotalLead.setCallback(this, function(response) {
      let state = response.getState();      
      if (state) {        
        cmp.set("v.totalNumberOfRows", response.getReturnValue());
      }
      else {
        console.log("error");
      }
    });
    $A.enqueueAction(actionTotalLead);

    let action = cmp.get("c.getListEmail");
    action.setParams({      
      recordOffset : cmp.get("v.data").length,
      recordLimit : cmp.get("v.rowsToLoad"),        
    });

    action.setCallback(this, function(response) {
       var state = response.getState();
       if (state === "SUCCESS") {            
          let data = response.getReturnValue();
          data.forEach( function(item) {                            
            let Name = 'none name';
            let link = '/task/s/message'
            let Id = '';
            if (item.Name !== undefined) {                            
              Name = item.Name;
              Id = item.Id;
              link = '/task/s/lead-single-page?recordId=' + Id;
            }            
            item.Name = Name;            
            item.Link = link;            
          });               
          cmp.set("v.data", data);           
          cmp.set('v.loadMoreStatus', '');
          event.getSource().set("v.isLoading", false);
       }
       else if (state === "ERROR") {          
          console.log("error");
       }
    });
    $A.enqueueAction(action);
  },

  fetchData: function (cmp,  event, numberOfRecords) {
    
    let action = cmp.get("c.getListEmail");
    action.setParams({      
      recordOffset : cmp.get("v.data").length,
      recordLimit : cmp.get("v.rowsToLoad"),        
    });
    action.setCallback(this, function(response) {
       let state = response.getState();
        if (state === "SUCCESS") {
          if (response.getReturnValue() == []) {
            cmp.set('v.loadMoreStatus', '');          
            event.getSource().set("v.isLoading", false);
            return;
          };
          if (cmp.get('v.data').length >= cmp.get('v.totalNumberOfRows')) {
              cmp.set('v.enableInfiniteLoading', false);
              cmp.set('v.loadMoreStatus', 'No more data to load');
          } else {
              let currentData = cmp.get('v.data');
              let newData = response.getReturnValue() || [];
              newData.forEach( function(item) {                            
                let Name = 'none name';
                let link = '/task/s/message'                
                if (item.Name !== undefined) {                            
                  Name = item.Name;                  
                  link = '/task/s/lead-single-page?recordId=' + item.Id;;
                }               
                item.Name = Name;            
                item.Link = link;            
              });          
              // console.log("\n\nnew data", newData);            
              cmp.set('v.data', currentData.concat(newData));
              cmp.set('v.loadMoreStatus', '');
          }
          event.getSource().set("v.isLoading", false);
        }
        else if (state === "ERROR") {
          console.log('error');
        }
   });

   $A.enqueueAction(action);
  },

  eventNavigateToLead: function(component, event) {
    let row = event.getParam('row');
    let toLeadSinglePage = $A.get("e.force:navigateToURL");    
    toLeadSinglePage.setParams({ "url": row.Link });
    toLeadSinglePage.fire();
  },

  eventOpenMessageInfo: function(component, event) { 
    let action = event.getParam('action');
    let row = event.getParam('row');
    let leadId = event.getParam('row').Id;    
    // console.log('params = ', JSON.stringify(event.getParams()));
    // console.log("leadid = ", leadId);
    let messageEvent = $A.get("e.c:sendMessageInfo");          
    messageEvent.setParams({ "leadId" : leadId });          
    messageEvent.fire();    
  }

})