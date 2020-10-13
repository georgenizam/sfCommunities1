({
    initCred: function(component, event, helper) {
      let userCred = {};      
      component.set("v.Spinner", true);   
      let action = component.get("c.getCredential");      
      action.setCallback(this, function(response) {
          var state = response.getState();        
          if (state === "SUCCESS") {                      
            component.set('v.data', response.getReturnValue());    
            component.set("v.Spinner", false);           
            return true;
          }
          else {            
            return false;
          }        
      });
      $A.enqueueAction(action);
    },

    saveCred: function(component, event, helper) {
      component.set("v.Spinner", true);   
      let userCred = {};      
      userCred.salesforce_username__c = component.find("salesforceUsername").get("v.value");
      userCred.username_gmail__c = component.find("usernameGmail").get("v.value");
      userCred.password_gmail__c = component.find("passwordGmail").get("v.value");

      let action = component.get("c.saveCredential");    
      action.setParams({ newCred: userCred });        
      action.setCallback(this, function(response) {
          var state = response.getState();        
          if (state === "SUCCESS") {          
            // console.log("\n\n\nyes\n\n\n");
            // console.log(response.getReturnValue());
            component.set("v.Spinner", false);   
            console.log('credential \n\n\n');
            let toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Success!",
                "type": "success",
                "message": "Success! New credential data saved!"
            });
            toastEvent.fire();
            return true;
          }
          else {            
            component.set("v.Spinner", false); 
            let toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
              "title": "Error!",
              "type": "error",
              "message": "Error! New credential data not saved!"
            });  
            console.log('errror \n\n\n');
            return false;
          }        
      });
      $A.enqueueAction(action);
    }
})
