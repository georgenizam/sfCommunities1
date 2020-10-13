({    
  handleApplicationEvent: function(component, event, helper) {    
    const leadId = event.getParam("leadId");
    if (!leadId) {
      return;
    }    
    
    component.set("v.Spinner", true);
    var action = component.get("c.getEmailMessage");
    action.setParams({ idLead: `${leadId}` });
    action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === "SUCCESS") {            
          // console.log("result = ", response.getReturnValue());     
          component.set('v.record', response.getReturnValue());          
          component.set("v.Spinner", false);
        }
        else {
          component.set('v.record', '');          
          component.set("v.Spinner", false);
          console.log("error");
        }
    });
    $A.enqueueAction(action);
  }
})
