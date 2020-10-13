({
    init: function(component, event, helper) {
      component.set("v.Spinner", true);      
      let actionSetDefaultTmpl = component.get("c.getEmailTemplateLead");
      actionSetDefaultTmpl.setParams({ leadId: component.get("v.leadId") });
      console.log("\n\nrecord id = ", component.get("v.leadId"));
      actionSetDefaultTmpl.setCallback(this, function(response) {
        let state = response.getState();        
        if (state === "SUCCESS") {     
          console.log('return value = ', response.getReturnValue());
          component.set("v.value", response.getReturnValue());          
        }
        else {
          console.log("\n\nerror\n\n");
        }          
      });
      $A.enqueueAction(actionSetDefaultTmpl);  
      
      let action = component.get("c.getEmailTemplates");      
      action.setCallback(this, function(response) {
        let state = response.getState();        
        if (state === "SUCCESS") {                        
          // component.set('v.leadRecord', response.getReturnValue()); 
          let optionsArr = response.getReturnValue().map(function(item) {
            return { 'label': item.Name, 'value': item.Name };
          });          
          component.set("v.options", optionsArr);
          component.set("v.Spinner", false);
        }          
      });
      $A.enqueueAction(action);     
    },

    closeModal: function(component, event, helper) {
      component.set("v.isModalOpen", false);
    },

    saveEmailTemplate: function(component, event, helper) {      
      let action = component.get("c.setEmailTemplateLead");        
      action.setParams({ newEmailTemplateId: component.get("v.value"), leadId: component.get("v.leadId") });   
      action.setCallback(this, function(response) {
        let state = response.getState();        
        if (state === "SUCCESS") {              
          let toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
              "title": "Success!",
              "type": "success",
              "message": 'Success! Email template for lead changed !'
          });
          toastEvent.fire();              
          component.set("v.isModalOpen", false);
        }    
        else {
          let toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
              "title": "Error!",
              "type": "error",
              "message": 'Error! Email template for lead not changed !'
          });
          toastEvent.fire();              
          component.set("v.isModalOpen", false);
        }      
      });
      $A.enqueueAction(action); 
    }
})
