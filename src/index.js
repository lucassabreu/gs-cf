import Inferno from 'inferno';
import { Router, Route, IndexRoute } from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import './registerServiceWorker';
import authorizedOnly from './authorizedOnly';

const browserHistory = createBrowserHistory();

const Login = (props, cb) => import('./Login').then(component => cb(null, component.default));
const SheetHome = (props, cb) => import('./SheetHome').then(component => cb(null, component.default));

const Home = (props, cb) => import('./Home').then(component => cb(null, component.default));
const NoMatch = (props, cb) => import('./NoMatch').then(component => cb(null, component.default));

Inferno.render(
  (
    <Router history={browserHistory}>
      <Route component={App}>
        <IndexRoute onEnter={authorizedOnly} getComponent={Home} />
        <Route path="/login" getComponent={Login} />
        <Route path="/sheet/:id" getComponent={SheetHome} />
        <Route path="*" getComponent={NoMatch} />
      </Route>
    </Router>
  ),
  document.getElementById('app')
);
