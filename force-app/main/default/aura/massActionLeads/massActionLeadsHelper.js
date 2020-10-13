({  
  getListLead: function(component, event) {
    let action = component.get("c.getListLeadForAction");        
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
      { label: 'Delete', type: 'button-icon', initialWidth: 70, typeAttributes: {iconName: 'utility:delete', label: 'Delete', name: 'deleteLead', title: 'Delete record', } },
      { label: 'Name', fieldName: 'Name', type: 'button', sortable: true, typeAttributes: { label: { fieldName: 'Name' }, name: 'lead', title: { fieldName: 'Name' } } },
      { label: 'Company', fieldName: 'Company', type: 'text', cellAttributes: { alignment: 'left' } },        
      { label: 'Last Connection', fieldName: 'lastConnection__c', type: 'date', cellAttributes: { alignment: 'left' }, typeAttributes: { year: "numeric", month: "long", day: "2-digit" } },
      { label: 'Info', type: 'button-icon', initialWidth: 70, typeAttributes: {iconName: 'utility:info', label: 'Info', name: 'showInfoLead', title: 'Show info about lead'} }
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

  deleteLead: function(component, event) {
    let leadId = event.getParam('row').Id;    
    let newData = component.get("v.listLeads");
    let inx = newData.findIndex((element) => element.Id == leadId );
    newData.splice(inx, 1);    
    component.set("v.listLeads", newData);  
    this.setDataTable(component, event, 1);
    this.generatePagination(component, event);
  },

  addLead: function(component, event) {
    let newData = component.get("v.listLeads");    
    const newLead = event.getParam('lead');
    newData.push(newLead);        
    component.set("v.listLeads", newData);      
    this.setDataTable(component, event, 1);
    this.generatePagination(component, event);
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

    let maxCountPage = component.get("v.maxCountPage");
    component.set("v.curPage", 1);
    let amountMiddlePage = maxCountPage <= amountMiddlePageVar ? maxCountPage : amountMiddlePageVar;
    for (let i=1; i<amountMiddlePage; i++) {
      countPage.push(i + 1);
    }    
    console.log(countPage);
    component.set("v.countPage", countPage);
  },

  updatePagination: function(component, event, numPage, direction) {    
    // if ()
    const leads = component.get("v.listLeads").length;
    const amountMiddlePages = 5;
    const maxAmountLead = 5; 
    const allPages = Math.ceil(leads / maxAmountLead);        
    let countPage = [];    
    if (direction == 'next') {      
      let startCountPage = +(component.get("v.curPage")) + 1;      
      let amountPage = (allPages - startCountPage) > amountMiddlePages ? amountMiddlePages : allPages - startCountPage;      
      for (let i=startCountPage; i<(startCountPage + amountPage); i++) {
        countPage.push(i);        
      }
    }
    if (direction == 'prev') {
      let startCountPage = component.get("v.curPage") - 1;
      let amountPage = (startCountPage - amountMiddlePages) > 0 ? amountMiddlePages : startCountPage - amountMiddlePages;
      for (let i=startCountPage; i>(startCountPage - amountPage); i--) {
        countPage.push(i);
      }
    }
    console.log('countPage = ', countPage);
    // component.set("v.countPage", countPage);
    
    // component.set("v.countPage", countPage);
    // console.log("length = ", component.get("v.listLeads").length);

  },


})
