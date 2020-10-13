({    
  init: function(component, event, helper) {
    component.set("v.Spinner", true);
    helper.setColumns(component);
    helper.getListLead(component);    
  },

  handleApplicationEvent: function(component, event, helper) {
    helper.addLead(component, event);
  },

  handleRowAction: function(component, event, helper) {
    let action = event.getParam('action');    
    switch (action.name) {
        case 'deleteLead':
            helper.deleteLead(component, event);
            break;
        case 'showInfoLead':
            helper.showInfoLead(component, event);
            break;
        case 'lead':
            helper.toLeadSinglePage(component, event);
            break;
        default:
            break;
    }
  },
  // openLeadDetails: function(component, event, helper) {
  //   let leadId = component.get("v.leadRecord.Id");  
  //   let link = '/task/s/lead-single-page?recordId=' + leadId;
  //   var urlEvent = $A.get("e.force:navigateToURL");      
  //   urlEvent.setParams({ "url": link });
  //   urlEvent.fire();    
  // }

  doNavigate: function(component, event, helper) {
    
    let indx = event.getSource().get("v.name");
    helper.setDataTable(component, event, indx);
    component.set("v.curPage", indx);    
  },

  doPrev: function(component, event, helper) {
    let curPos = component.get("v.curPage");
    if (component.get("v.minCountPage") < curPos) {
      component.set("v.curPage", --curPos);    
      helper.updatePagination(component, event, curPos, 'prev');
      helper.setDataTable(component, event, curPos);
      // component.set("v.curPage", indx);    
    }    
  },

  doNext: function(component, event, helper) {
    let curPos = component.get("v.curPage");
    if (component.get("v.maxCountPage") > curPos) {
      component.set("v.curPage", ++curPos);
      helper.updatePagination(component, event, curPos, 'next');
      helper.setDataTable(component, event, curPos);
    }    
  },

  sendMassMailing: function(component, event, helper) {
    console.log('mass mailing');
  }

})
