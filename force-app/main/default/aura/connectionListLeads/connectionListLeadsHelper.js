({  
  getListLead: function(component, event) {
    let action = component.get("c.getListLead");        
    action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === "SUCCESS") {                                          
          component.set('v.listLeads', response.getReturnValue());
          // this.updatePagination(component);
          this.setDataTable(component, event, 1);
          let maxValue = Math.ceil(response.getReturnValue().length / +component.get("v.amountRows"));
          component.set("v.maxCountPage", maxValue);
          this.generatePagination(component, event);
        }
        else {
          component.set('v.listLeads', '');                    
          console.log("error");
        }
        component.set("v.Spinner", false);
    });
    $A.enqueueAction(action);
  },

  setColumns: function(component) {
    let columns = [      
      { label: 'Add', type: 'button-icon', initialWidth: 70, typeAttributes: {iconName: 'utility:add', label: 'Add', name: 'addLead', title: 'Add Lead record', } },
      { label: 'Name', fieldName: 'Name', type: 'button', sortable: true, typeAttributes: { label: { fieldName: 'Name' }, name: 'lead', title: { fieldName: 'Name' } } },
      { label: 'Company', fieldName: 'Company', type: 'text', cellAttributes: { alignment: 'left' } },        
      { label: 'Last Connection', fieldName: 'lastConnection__c', initialWidth: 150, type: 'date', cellAttributes: { alignment: 'left' }, typeAttributes: { year: "numeric", month: "long", day: "2-digit" } },
      { label: 'Info', type: 'button-icon', initialWidth: 70, typeAttributes: {iconName: 'utility:info', label: 'Info', name: 'showInfoLead', title: 'Show info about lead'} },
      { label: 'Week', type: 'button', initialWidth: 70, cellAttributes: { alignment: 'center' }, typeAttributes: {label: '+7', name: 'add7DaysDelay', title: 'Add delay 7 days lead'} },
      { label: 'Month', type: 'button', initialWidth: 80, typeAttributes: {label: '+30', name: 'add30DaysDelay', title: 'Add delay 30 days lead'} },
      { label: 'Send email', type: 'button', initialWidth: 140, typeAttributes: {label: '+Send email', name: 'sendEmail', title: 'SendEmail lead'} }
    ];
    component.set('v.columns', columns);
  },

  showInfoLead: function(component, event) {    
    let leadId = event.getParam('row').Id;//'00Q2w000004j4r1EAA';//event.getParam('row').Id;
    let urlEvent = $A.get("e.c:updateLeadInfo");    
    urlEvent.setParams({ "leadId": leadId });
    urlEvent.fire();
  },

  toLeadSinglePage: function(component, event) {    
    let leadId = event.getParam('row').Id;        
    let link = leadId == '' ? '/task/s/lead' : '/task/s/lead-single-page?recordId=' + leadId;
    let urlEvent = $A.get("e.force:navigateToURL");    
    urlEvent.setParams({ "url": link });
    urlEvent.fire();    
  },  

  addLead: function(component, event) {
    console.log('add new lead');
    let lead = event.getParam('row');
    let addLeadEvent = $A.get("e.c:addLeadToMassAction");    
    addLeadEvent.setParams({ "lead": lead });
    addLeadEvent.fire();

    let toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
        "title": "Success!",
        "type": "success",
        "message": `Success! Lead added to mass action!`
    });
    toastEvent.fire();  
    this.deleteLead(component, event);
    // let newData = component.get("v.listLeads");
    // newData.push(newLead);
    // component.set("v.listLeads", newData);  
    // this.setDataTable(component, event, 1);
    // this.generatePagination(component, event);
  },

  deleteLead: function(component, event) {
    let leadId = event.getParam('row').Id;    
    let newData = component.get("v.listLeads");
    let inx = newData.findIndex((element) => element.Id == leadId );
    newData.splice(inx, 1);    
    component.set("v.listLeads", newData);  
    this.setDataTable(component, event, 1);
    this.generatePagination(component, event);
  },

  sendEmailLead: function(component, event) {
    console.log('sendEmailLead');
  },

  add7DaysDelay: function(component, event) {
    console.log('add7DaysDelay');
  },

  add30DaysDelay: function(component, event) {
    console.log('add30DaysDelay');
  },



  setDataTable: function(component, event, curPage) {
    const amountMiddlePages = component.get("v.amountMiddlePage");
    const maxAmountLead = component.get("v.amountRows");
    let leadsAll = component.get("v.listLeads");    
    let startPos = maxAmountLead * (curPage - 1);
    let endPos = maxAmountLead * curPage > leadsAll.length ? leadsAll.length : maxAmountLead * curPage;
    let leadsOnPage = leadsAll.slice(startPos, endPos);    
    // console.log('\n\nleadsOnPage = ', leadsOnPage);

    component.set("v.data", leadsOnPage);

  },
  generatePagination: function(component, event) {    
    let countPage = [];    
    let amountRows = component.get("v.amountRows");
    let amountMiddlePageVar = component.get("v.amountMiddlePage");    
    
    let maxValue = Math.ceil(component.get("v.listLeads").length / amountRows);
    component.set("v.maxCountPage", maxValue);

    // console.log('countPage = ', countPage);
    // console.log('amountRows = ', amountRows);
    // console.log('amountMiddlePageVar = ', amountMiddlePageVar);
    // console.log('maxValue = ', maxValue);
    component.set("v.curPage", 1);
    let curPage = component.get("v.curPage");
    if (maxValue > 2) {            
      let amountMiddlePage = maxValue < amountMiddlePageVar ? (maxValue - 1) : amountMiddlePageVar;      
      for (let i=0; i<amountMiddlePage; i++) {
        countPage.push(curPage + i + 1);
      }    
    }
    // let maxCountPage = component.get("v.maxCountPage");
    // component.set("v.curPage", 1);
    // let amountMiddlePage = maxCountPage < amountMiddlePageVar ? maxCountPage : amountMiddlePageVar;
    // if (maxCountPage == 1) amountMiddlePage = 0;
    // console.log('amountMiddlePage = ', amountMiddlePage);
    // for (let i=1; i<amountMiddlePage+1; i++) {
    //   countPage.push(i + 1);
    // }    
    // console.log(countPage);
    component.set("v.countPage", countPage);
  },

  updatePagination: function(component, event, numCurPage, direction) {    
    
    let countPage = [];
    let countMidPages = component.get("v.countPage");   
    let startMidPage = countMidPages[0];
    let endMidPage =  countMidPages[countMidPages.length-1];        

    let amountRows = component.get("v.amountRows");
    let maxValue = Math.ceil(component.get("v.listLeads").length / amountRows);

    console.log('startMidPage = ', startMidPage);
    console.log('endMidPage = ', endMidPage);
    console.log('countMidPages = ', countMidPages);

    if (direction == 'next' && endMidPage < numCurPage) {      
      let amountMiddlePage = maxValue - numCurPage;  
      for (let i=0; i<amountMiddlePage; i++) {
        countPage.push(numCurPage + i);        
      }    
      component.set("v.countPage", countPage);      
      
    }
    
    
    
  },


})
