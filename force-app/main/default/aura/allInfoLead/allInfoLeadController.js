({
    init : function(component, event, helper) {
      component.set("v.Spinner", true);
      const leadId = component.get("v.recordId");
      if (!leadId) {
        return
      }
      var action = component.get("c.getAllInfoLead");
      action.setParams({ idLead: `${leadId}` });
      action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === "SUCCESS") {            
            component.set('v.leadRecord', response.getReturnValue());            
            component.set("v.Spinner", false);
          }
      });
      $A.enqueueAction(action);
    }    
})
