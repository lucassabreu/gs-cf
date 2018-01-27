import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Async from 'react-code-splitting'
import GoogleAPIService from './Google/GoogleAPIService';
import Private from './Security/Private'
import MainLayout from './Layout/MainLayout';
import MenuLayout from './Layout/MenuLayout';
import Login from './Security/Login';
import Logout from './Security/Logout';

import withSheet from './Google/withSheet';
import withUser from './Security/withUser';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

let withGoogleUser = withUser({
  addListener: (...params) => GoogleAPIService.addLoginListener(...params),
  removeListener: (...params) => GoogleAPIService.removeLoginListener(...params),
  isSignedIn: (...params) => GoogleAPIService.isSignedIn(...params),
  getUser: (...params) => GoogleAPIService.getUser(...params),
})
let withGoogleSheet = withSheet((id) => GoogleAPIService.getSheet(id));

let GooglePrivate = withGoogleUser(Private)
let withAsync = (importFn, name) => {
  const WithAsync = (props) => <Async load={importFn} componentProps={props} />
  WithAsync.displayName = 'WithAsync' + (name ? `(${name})` : '');
  return WithAsync
};

let renderWithLayout = (Layout) => (WrappedComponent) => (props) => <Layout><WrappedComponent {...props} /></Layout>;
let renderWithMainLayout = renderWithLayout(withGoogleUser(MainLayout));
let renderWithMenuLayout = renderWithLayout(withGoogleUser(MenuLayout));

const LoginWithUser = withGoogleUser(Login);
const ImportScript = withAsync(import('./ImportScript'), 'ImportScript');

const SheetHome = withGoogleSheet(withAsync(import('./SheetHome'), 'SheetHome'));
const MonthDetail = withGoogleSheet(withAsync(import('./Sheet/MonthDetail'), 'MonthDetail'));
const MonthCompare = withGoogleSheet(withAsync(import('./Sheet/MonthCompare'), 'MonthCompare'));
const Home = withGoogleUser(withAsync(import('./Home'), 'Home'));
const Dashboard = withGoogleSheet(withAsync(import('./Dashboard/Dashboard'), 'Dashboard'));

const NoMatch = withAsync(import('./NoMatch'));

const App = () => (
  <Switch>
    <Route exact path="/login"
      render={(props) => <LoginWithUser signIn={async () => await GoogleAPIService.signIn()} {...props} />} />
    <Route exact path="/logout"
      render={(props) => <Logout signOut={async () => await GoogleAPIService.signOut()} {...props} />} />

    <Route path="/import-script" render={renderWithMainLayout(ImportScript)} />
    <GooglePrivate exact path="/" render={renderWithMainLayout(Home)} />
    <GooglePrivate exact path="/sheet/:sheetId" render={renderWithMainLayout(SheetHome)} />
    <GooglePrivate exact path="/sheet/:sheetId/compare" render={renderWithMainLayout(MonthCompare)} />
    <GooglePrivate exact path="/sheet/:sheetId/:year-:month" render={renderWithMainLayout(MonthDetail)} />

    <GooglePrivate path="/sheet/:sheetId/dashboard" render={renderWithMenuLayout(Dashboard)} />

    <Route render={renderWithMainLayout(NoMatch)} />
  </Switch>
);

export default App;
