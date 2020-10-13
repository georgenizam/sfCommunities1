({
  onClick: function(component, event) {
      let id = event.target.dataset.menuItemId;
      component.getSuper().navigate(id);
  }
})