({
  init: function(component, event, helper) {
    let comp = component.find('notifLib')
    let obj = {
        "variant": "",
        "title": "",
        "mode": "sticky"        
    };  
    let successMes = component.get("v.successMes");
    console.log(successMes);
    if (successMes) {
      obj.variant = "success";
      obj.title = "You created a lead record";
    }
    else {
      obj.variant = "error";
      obj.title = "An error occurred while creating/updating a lead record";
    }
    comp.showToast(obj);        
  }
  
})
