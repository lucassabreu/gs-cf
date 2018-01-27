import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Async from 'react-code-splitting'
import GoogleAPIService from './Google/GoogleAPIService';
import Private from './Security/Private'
import MainLayout from './Layout/MainLayout';

import withSheet from './Google/withSheet';
import withUser from './Security/withUser';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Logout from './Security/Logout';

let withGoogleUser = withUser({
  addListener: (...params) => GoogleAPIService.addLoginListener(...params),
  removeListener: (...params) => GoogleAPIService.removeLoginListener(...params),
  isSignedIn: (...params) => GoogleAPIService.isSignedIn(...params),
  getUser: (...params) => GoogleAPIService.getUser(...params),
})
let withGoogleSheet = withSheet((id) => GoogleAPIService.getSheet(id));

let GooglePrivate = withGoogleUser(Private)
let async = (importFn, name) => {
  const WithAsync = (props) => <Async load={importFn} componentProps={props} />
  WithAsync.displayName = 'WithAsync' + (name ? `(${name})` : '');
  return WithAsync
};

let GoogleMainLayout = withGoogleUser(MainLayout);

const Login = withGoogleUser(async(import('./Security/Login'), 'Login'));
const ImportScript = async(import('./ImportScript'), 'ImportScript');

const SheetHome = withGoogleSheet(async(import('./SheetHome'), 'SheetHome'));
const MonthDetail = withGoogleSheet(async(import('./Sheet/MonthDetail'), 'MonthDetail'));
const MonthCompare = withGoogleSheet(async(import('./Sheet/MonthCompare'), 'MonthCompare'));
const Home = withGoogleUser(async(import('./Home'), 'Home'));

const NoMatch = async(import('./NoMatch'));

const App = () => (
  <Switch>
    <Route exact path="/login"
      render={(props) => <Login signIn={async () => await GoogleAPIService.signIn()} {...props} />} />
    <Route exact path="/logout"
      render={(props) => <Logout signOut={async () => await GoogleAPIService.signOut()} {...props} />} />

    <GoogleMainLayout>
      <Route path="/import-script" component={ImportScript} />
      <GooglePrivate exact path="/" component={Home} />
      <GooglePrivate exact path="/sheet/:sheetId" component={SheetHome} />
      <GooglePrivate exact path="/sheet/:sheetId/compare" component={MonthCompare} />
      <GooglePrivate exact path="/sheet/:sheetId/:year-:month" component={MonthDetail} />
    </GoogleMainLayout>
    <Route component={NoMatch} />
  </Switch>
);

export default App;
