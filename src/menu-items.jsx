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
          id: 'stock-table',
          title: 'Stock List',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/bootstrap'
        },
        {
          id: 'wedding-table',
          title: 'Weddings',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/wedding'
        },
        {
          id: 'add-wedding',
          title: 'Add Weddings',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/forms/add-wedding'
        },
        {
          id: 'add-coffee',
          title: 'Add Coffee Shop Cost',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/forms/add-coffeshop'
        },
        {
          id: 'add-inventory',
          title: 'Add Inventory',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/forms/add-inventory'
        },
        {
          id: 'inventor-table',
          title: 'Inventory List',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/inventory'
        },
        {
          id: 'coffee-shop-list',
          title: 'Coffe shop List',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/coffeshop'
        },

      ]
    },
   
  ]
};

export default menuItems;
