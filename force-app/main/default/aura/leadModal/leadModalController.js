({
    closeModal: function(component, event, helper) {    
      component.set("v.isModalOpen", false);
    },

    init: function (component, event, helper) {  
      component.set("v.Spinner", true);
      helper.setSelectOptions(component, event);            
      if (component.get("v.leadId") !== "" && component.get("v.edit")) {        
        helper.setFieldsVal(component, event, component.get("v.leadId"));        
      }            
    },

    saveLead: function(component, event, helper) {
      // console.log("\n\n\n result init - edit value ", component.get("v.edit"));      
      if (!helper.checkRequiredFields(component, event)) {        
        return;
      }
      
      helper.createLead(component, event, component.get("v.edit"));      
      
    },

})
