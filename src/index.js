import Inferno from 'inferno';
import { Router, Route, IndexRoute } from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import './registerServiceWorker';
import authorizedOnly from './authorizedOnly';

const browserHistory = createBrowserHistory();

const Login = (props, cb) => import('./Login').then(component => cb(null, component.default));

const Home = (props, cb) => import('./Home').then(component => cb(null, component.default));
const Other = (props, cb) => import('./Other').then(component => cb(null, component.default));
const NoMatch = (props, cb) => import('./NoMatch').then(component => cb(null, component.default));

Inferno.render(
  (
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/login" getComponent={Login} />
        <IndexRoute onEnter={authorizedOnly} getComponent={Home} />
        <Route onEnter={authorizedOnly} path="/other/:name" getComponent={Other} />
        <Route path="*" getComponent={NoMatch} />
      </Route>
    </Router>
  ),
  document.getElementById('app')
);
