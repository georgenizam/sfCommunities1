({
    addDays: function(component, event, days=0) {         
      const leadId = component.get("v.recordId");
      if (!leadId) {
        return;
      }      
      let action = component.get("c.addDays");      
      action.setParams({ idLead: `${leadId}`, amount: days });
      action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === "SUCCESS") {      
          let daysEvent = $A.get("e.c:addDaysEvent");          
          daysEvent.setParams({ "days" : days });          
          daysEvent.fire();
          let toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
              "title": "Success!",
              "type": "success",
              "message": `Success! Added ${days} days delay!`
          });
          toastEvent.fire();
        }
        else {
          let toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
              "title": "Error!",
              "type": "error",
              "message": `Error! Not added ${days} days delay!`
          });
          toastEvent.fire();
        }        
      });
      $A.enqueueAction(action);  
    }
})
