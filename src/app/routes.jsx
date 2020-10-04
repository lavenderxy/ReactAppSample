import React from 'react';
import MainView from './view/MainView';

const routes = [
  {
    path: '',
    action: () => <MainView />,
  },
  {
    path: '/route1',
    action: () => <MainView />,
  }
];

export default routes;