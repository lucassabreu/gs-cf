import React, { Component } from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom'
import Async from 'react-code-splitting'
import GoogleAPIService from './Google/GoogleAPIService';
import PropTypes from 'prop-types';
import Private from './Security/Private'

import Menu from './Menu'

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import withUser from './Security/withUser';

let withGoogleUser = withUser({
  addListener: (...params) => GoogleAPIService.addLoginListener(...params),
  removeListener: (...params) => GoogleAPIService.removeLoginListener(...params),
  isSignedIn: (...params) => GoogleAPIService.isSignedIn(...params),
  getUser: (...params) => GoogleAPIService.getUser(...params),
})

let GooglePrivate = withGoogleUser(Private)
let async = (importFn) => (props) => <Async load={importFn} componentProps={props} />;

const Login = withGoogleUser(async(import('./Login')));
const WithUserMenu = withGoogleUser(Menu);
const ImportScript = async(import('./ImportScript'));

const SheetHome = async(import('./SheetHome'));
const MonthDetail = async(import('./Sheet/MonthDetail'));
const MonthCompare = async(import('./Sheet/MonthCompare'));
const Home = async(import('./Home'));

const NoMatch = async(import('./NoMatch'));

class App extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);

    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  async signOut() {
    await GoogleAPIService.signOut();
  }

  async signIn() {
    await GoogleAPIService.signIn();
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <Link to="/" className="navbar-brand">GS CF</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbars"
            aria-controls="navbars" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <WithUserMenu signOut={this.signOut} />
        </nav>

        <div className="container-fluid">
          <div className="row justify-content-center">
            <main className="col-10 pt-3" role="main">
              <section className="row">
                <Switch>
                  <GooglePrivate exact path="/" component={Home} />
                  <Route path="/login" render={
                    (props) => <Login signIn={this.signIn} {...props} />
                  } />
                  <Route path="/import-script" component={ImportScript} />
                  <GooglePrivate exact path="/sheet/:id" component={SheetHome} />
                  <GooglePrivate exact path="/sheet/:id/compare" component={MonthCompare} />
                  <GooglePrivate exact path="/sheet/:id/:year-:month" component={MonthDetail} />
                  <Route component={NoMatch} />
                </Switch>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
