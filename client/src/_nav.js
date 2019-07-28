export default {
  items: [

    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Contacts',
      url:'/contact',
      icon:'fa fa-user',
    },
    {
      name: 'Groups',
      url: '/groups',
      icon: 'fa fa-users'
    },
    {
      name: 'Analysis',
      url: '/analysis',
      icon: 'fa fa-bar-chart'
    },
    {
      title: true,
      name: 'Filter',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Profile',
      url: '/Profile',
      icon: 'icon-user',
      class: 'mt-auto',
      // attributes: { target: '_blank', rel: "noopener" },
    },
    {
      name: 'Need Help?',
      url: 'https://coreui.io/pro/react/',
      icon: 'icon-bulb',
      attributes: { target: '_blank', rel: "noopener" },
    },
  ],
};
