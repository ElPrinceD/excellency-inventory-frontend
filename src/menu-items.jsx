const menuItems = {
  items: [
  
  
    {
      id: 'ui-forms',
      title: 'Elements',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Add Stock',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/forms/form-basic'
        },
        {
          id: 'table',
          title: 'Stock List',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/bootstrap'
        }
      ]
    },
   
  ]
};

export default menuItems;
