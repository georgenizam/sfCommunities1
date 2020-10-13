({
  

  DATA: [],
  
  setColumns: function(component) {
    let columns = [      
      { label: 'Name', fieldName: 'Name', type: 'button', sortable: true, typeAttributes: { label: { fieldName: 'Name' }, name: 'detail', title: { fieldName: 'Name' } } },
      { label: 'Company', fieldName: 'Company', type: 'text', cellAttributes: { alignment: 'left' } },
      { label: 'Title', fieldName: 'Title', type: 'text', cellAttributes: { alignment: 'left' } },
      { label: 'Phone', fieldName: 'Phone', type: 'phone', cellAttributes: { alignment: 'left' } },
      { label: 'Email', fieldName: 'Email', type: 'email', cellAttributes: { alignment: 'left' }, typeAttributes: { hideIcon: true } },
      { label: 'Connection', fieldName: 'CreatedDate', type: 'date', cellAttributes: { alignment: 'left' }, typeAttributes: { year: "numeric", month: "numeric", day: "numeric" } },
      { label: 'Last Connection', fieldName: 'lastConnection__c', type: 'date', cellAttributes: { alignment: 'left' }, typeAttributes: { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false } }
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
    let actionTotalLead = cmp.get("c.getTotalLeads");    
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

    let action = cmp.get("c.getListLeads");
    action.setParams({      
      recordOffset : cmp.get("v.data").length,
      recordLimit : cmp.get("v.rowsToLoad"),        
    });
    action.setCallback(this, function(response) {
       var state = response.getState();
       if (state === "SUCCESS") {           
          let data = response.getReturnValue();
          data.forEach( function(item) {                
            let arrayName = item.Name.toLowerCase().split(' ');
            let link = '/task/s/lead-single-page?recordId=' + item.Id;            
            item.Link = link;
          });
          console.log("\n\n data", data);            
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
    let action = cmp.get("c.getListLeads");
    action.setParams({
      recordOffset : cmp.get("v.data").length,
      recordLimit : cmp.get("v.rowsToLoad"),  
    });
    action.setCallback(this, function(response) {
       let state = response.getState();
        if (state === "SUCCESS") {
           
          if (cmp.get('v.data').length >= cmp.get('v.totalNumberOfRows')) {
              cmp.set('v.enableInfiniteLoading', false);
              cmp.set('v.loadMoreStatus', 'No more data to load');
          } else {
              let currentData = cmp.get('v.data');
              let newData = response.getReturnValue();
              newData.forEach( function(item) {                
                let arrayName = item.Name.toLowerCase().split(' ');
                let link = '/task/s/lead-single-page?recordId=' + item.Id;                
                item.Link = link;
              });                
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


  fetchAccounts : function(component, event, offSetCount) {    
      let action = component.get("c.getListLeads");
      action.setParams({ "intOffSet" : offSetCount });
      
      action.setCallback(this, function(response) {        
        let state = response.getState();
        if (state === "SUCCESS") {
          let records = response.getReturnValue();          
          let currentData = component.get('v.data');                
          component.set("v.data", currentData.concat(records));          
        }        
        event.getSource().set("v.isLoading", false);        
      });          
  },

  eventNavigateToLead: function(component, event) {
    let row = event.getParam('row');
    console.log("\n\nrow:\n\n", row.Link);
    let toLeadSinglePage = $A.get("e.force:navigateToURL");    
    toLeadSinglePage.setParams({ "url": row.Link });
    toLeadSinglePage.fire();
  },

})