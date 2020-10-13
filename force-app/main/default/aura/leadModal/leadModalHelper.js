({
  setSelectOptions: function (cmp, event) {
    let action = cmp.get("c.getOptionsFields");    
    action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === "SUCCESS") {          
          let res = response.getReturnValue();          
          const startOption = 'None';
          res.unshift(startOption);          
          
          let options = res.map(function(item, i) {
            let obj = {
              id: item, 
              label: item, 
              selected: false
            }       
            obj.selected = (obj.id === startOption);                 
            return obj;
          });                    
          cmp.set('v.options', options);
          cmp.set('v.selectedValue', startOption);    
          cmp.set("v.Spinner", false);   
        }
    });
    $A.enqueueAction(action);    
  },

  checkRequiredFields: function(component, event) {        
    return component.find("leadform").reduce(function (validSoFar, inputCmp) {      
      inputCmp.showHelpMessageIfInvalid();
      return validSoFar && inputCmp.get('v.validity').valid;
    }, true);      
  },

  getFieldsVal: function(component, event) {
    let newLead = component.get("v.leadRecord");
    return newLead;    
  },

  setFieldsVal: function(component, event, leadIdString) {      
    let action = component.get("c.getLead");    
    action.setParams({ leadId: leadIdString });    
    action.setCallback(this, function(response) {
        var state = response.getState();        
        if (state === "SUCCESS") {              
          component.set('v.leadRecord', response.getReturnValue());   
          component.set("v.Spinner", false);           
        }          
    });
    $A.enqueueAction(action);      
  },

  createLead: function(component, event, editFlag=false) {
    const fieldsValues = this.getFieldsVal(component, event);    
    console.log("\nfieldsValues\n\n", fieldsValues);
    let action = component.get("c.addNewLead");    
    action.setParams({ leadRecord: fieldsValues });    
    action.setCallback(this, function(response) {
        var state = response.getState();  
        console.log('state\n\n', state);      
        if (state === "SUCCESS") {  
          console.log("\n\nsuccens\n\n");
          let toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
              "title": "Success!",
              "type": "success",
              "message": `Success! ${editFlag ? 'New Lead created' : 'Lead updated'} !`
          });
          toastEvent.fire();    
          component.set("v.isModalOpen", false);       
          return true;
        }
        else {
          console.log("\n\ncreate not lead");
          let toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
              "title": "Error!",
              "type": "error",
              "message": `Success! ${editFlag ? 'New Lead not created' : 'Lead not updated'} !`
          });
          toastEvent.fire();        
          component.set("v.isModalOpen", false);          
          return false;
          
        }    
        
    });
    $A.enqueueAction(action);
  }

})
