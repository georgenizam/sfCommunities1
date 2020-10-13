({
    updateData: function(component, event, helper) {     
      component.set("v.Spinner", true); 
      const leadId = event.getParam("leadId");//"00Q2w000004j4r1EAA";//component.get("v.recordId");    
      if (!leadId) {
        return;
      }
      
      let action = component.get("c.getEmailMessages");    
      action.setParams({ idLead: `${leadId}` });
      action.setCallback(this, function(response) {          
          let state = response.getState();
          if (state === "SUCCESS") {              
            component.set('v.emailRecords', response.getReturnValue());                              
            component.set("v.Spinner", false);
          }
          else {            
            component.set("v.Spinner", false);
            console.log("error");
          }
      });
      $A.enqueueAction(action);
    },

    openMessagesList: function(component, event, helper) {      
      let link = '/task/s/message';
      var toMessagePage = $A.get("e.force:navigateToURL");      
      toMessagePage.setParams({ "url": link });
      toMessagePage.fire();    
    }
})
