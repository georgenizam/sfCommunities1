({
  getAndSetData: function(component, event, leadId) {
    component.set("v.Spinner", true);
    var action = component.get("c.getEmailInfo");
    action.setParams({ idLead: `${leadId}` });
    action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === "SUCCESS") {                    
          let res = response.getReturnValue();

          console.log("\nres\n\n", res);

          res.widthBar7days = +res.delay_7_days * 100 / (+res.delay_7_days + +res.delay_30_days + (+res.delay_7_days == 0 || res.delay_30_days == 0 ? 1 : 0 ));
          res.widthBar30days = +res.delay_30_days * 100 / (+res.delay_7_days + +res.delay_30_days + (+res.delay_7_days == 0 || res.delay_30_days == 0 ? 1 : 0 ));
          res.maxwidthBar = +res.delay_7_days + +res.delay_30_days;          
          component.set('v.record', res);            
          component.set("v.Spinner", false);
        }    
        else {
          console.log("errorrrr");
        }    
    });
    $A.enqueueAction(action);
  }
})
