({  
  openEmail: function(component, event, helper) {      
    let messageOpen = !component.get('v.messageOpen');
    component.set('v.messageOpen', messageOpen);
  }
})
