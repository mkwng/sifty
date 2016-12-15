import React from 'react';
import { Route, IndexRoute } from 'react-router';

import HomePage from './components/HomePage';
import App from './components/App';
import About from './components/About';
import Login from './components/Login';
import Logout from './components/Logout';
import Profile from './components/Profile';
import Post from './components/Post';
import Create from './components/Create';
import NotFound from './components/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/about" component={About} />
    <Route path="/login" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/profile" component={Profile} />
    <Route path="/profile/:user" component={Profile} />
    <Route path="/profile/:user/:post" component={Post} />
    <Route path="/create" component={Create} />
    <Route path="*" component={NotFound} />
  </Route>
);
