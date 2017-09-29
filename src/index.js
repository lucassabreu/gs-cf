import { render } from 'inferno';
import { Router, Route, IndexRoute } from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import './index.css';

const Home = (props, cb) => import ('./Home').then(component => cb(null, component.default))
const NoMatch = (props, cb) => import ('./NoMatch').then(component => cb(null, component.default))

const browserHistory = createBrowserHistory();

render(
  <Router history={browserHistory}>
    <Route component={App}>
      <IndexRoute getComponent={Home} />
      <Route path="*" getComponent={NoMatch} />
    </Route>
  </Router>,
  document.getElementById('app')
);
