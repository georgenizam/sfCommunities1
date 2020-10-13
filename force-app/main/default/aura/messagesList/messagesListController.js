({
  init: function(component, event, helper) {
    helper.setColumns(component, event, helper);      
    helper.initData(component, event, component.get("v.data").length);  
  },

  handleSort: function(component, event, helper) {
    helper.handleSort(component, event, helper);
  },  

  openModal: function(component, event, helper) {    
    component.set("v.isModalOpen", true);
  },

  handleRowAction: function(component, event, helper) {    
    let action = event.getParam('action');        

    switch (action.name) {
        case 'detail':
            helper.eventNavigateToLead(component, event);
            break;
        case 'info':
            helper.eventOpenMessageInfo(component, event);            
            break;
        default:
            break;
    }    
  },

  loadMoreData: function (component, event, helper) {
    var rowsToLoad = component.get('v.rowsToLoad');
    event.getSource().set("v.isLoading", true);
    component.set('v.loadMoreStatus', 'Loading');    
    helper.fetchData(component, event, component.get("v.data").length);
  }
    
  // }

});