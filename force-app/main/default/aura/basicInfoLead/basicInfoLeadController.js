({  
  init : function(component, event, helper) {
    // cmp.set("v.openSpinner", true);
    // 00Q2w000004j4r1EAA
    const leadId = component.get("v.recordId");    
    if (!leadId) {
      return
    }
    var action = component.get("c.getBasicInfoLead");
    action.setParams({ idLead: `${leadId}` });
    action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === "SUCCESS") {      
          // console.log(response.getReturnValue());
          const res = response.getReturnValue();
          this.nameLead = res.Name;
          component.set('v.leadRecord', res);            
        }
    });
    $A.enqueueAction(action);
  },

  openModalNewLead: function(component, event, helper) {    
    component.set("v.titleForm", "Create new Lead");
    component.set("v.leadEdit", false);
    component.set("v.isModalLeadOpen", true);    
  },

  openModalEditLead: function(component, event, helper) {    
    const nameLead = component.get("v.leadRecord.Name");
    component.set("v.titleForm", `Edit Lead: ${nameLead}`);
    component.set("v.leadEdit", true);    
    component.set("v.isModalLeadOpen", true);
  },

  add7DaysLead: function(component, event, helper) {    
    helper.addDays(component, event, 7);                  
  },

  add30DaysLead: function(component, event, helper) {    
    helper.addDays(component, event, 30);    
  },

  openModalSendEmail: function(component, event, helper) {
    component.set("v.isModalEmailOpen", true);
  }  

  
})
