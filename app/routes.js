import React from 'react';
import { Route, IndexRoute } from 'react-router';

import HomePage from './components/HomePage';
import App from './components/App';
import About from './components/About';
import Login from './components/Login';
import Logout from './components/Logout';
import NotFound from './components/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/about" component={About} />
    <Route path="/login" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="*" component={NotFound} />
  </Route>
);
