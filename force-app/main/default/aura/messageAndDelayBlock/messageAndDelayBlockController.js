({

  init: function(component, event, helper) {
    // cmp.set("v.openSpinner", true);    
    const leadId = component.get("v.recordId");    
    if (!leadId) {
      return
    }
    helper.getAndSetData(component, event, leadId);
  },
  handleApplicationEvent: function(component, event, helper) {
    var days = event.getParam("days");
    const leadId = component.get("v.recordId");    
    if (!leadId) {
      return
    }
    helper.getAndSetData(component, event, leadId);    
  }  

})
