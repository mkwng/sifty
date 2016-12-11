// @flow
import React from 'react';
import { render } from 'react-dom';
import { hashHistory } from 'react-router';
import Routes from './routes';
import './app.global.css';


render(
  <div>
    <Routes history={hashHistory} />
  </div>,
  document.getElementById('root')
);
