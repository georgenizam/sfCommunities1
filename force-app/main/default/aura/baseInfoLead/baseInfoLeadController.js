({
  updateData: function(component, event, helper) {
    component.set("v.Spinner", true);
    
    const leadId = event.getParam("leadId");//"00Q2w000004j4r1EAA";//component.get("v.recordId");    
    if (!leadId) {
      return;
    }
    let action = component.get("c.getLeadBaseInfo");    
    action.setParams({ leadId: `${leadId}` });
    action.setCallback(this, function(response) {
        let state = response.getState();
        if (state === "SUCCESS") {                                
          component.set('v.leadRecord', response.getReturnValue());          
          component.set("v.Spinner", false);
        }
        else {
          component.set('v.leadRecord', '');          
          component.set("v.Spinner", false);
          console.log("error");
        }
    });
    $A.enqueueAction(action);
  },

  openLeadDetails: function(component, event, helper) {
    let leadId = component.get("v.leadRecord.Id");  
    let link = '/task/s/lead-single-page?recordId=' + leadId;
    var toLeadSinglePage = $A.get("e.force:navigateToURL");      
    toLeadSinglePage.setParams({ "url": link });
    toLeadSinglePage.fire();    
  }  

})
