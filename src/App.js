import React, { Component } from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom'
import Async from 'react-code-splitting'
import { AuthorizedOnlyAsync } from './Google/AuthorizedOnly';
import GoogleAPIService from './Google/GoogleAPIService';
import PropTypes from 'prop-types';

import Menu from './Menu'

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const Login = (props) => <Async load={import('./Login')} componentProps={props} />;
const ImportScript = (props) => <Async load={import('./ImportScript')} componentProps={props} />;

const SheetHome = (props) => <AuthorizedOnlyAsync load={import('./SheetHome')} componentProps={props} />;
const MonthDetail = (props) => <AuthorizedOnlyAsync load={import('./Sheet/MonthDetail')} componentProps={props} />;
const MonthCompare = (props) => <AuthorizedOnlyAsync load={import('./Sheet/MonthCompare')} componentProps={props} />;
const Home = (props) => <AuthorizedOnlyAsync load={import('./Home')} componentProps={props} />;

const NoMatch = (props) => <Async load={import('./NoMatch')} componentProps={props} />;

class App extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  async signOut() {
    await GoogleAPIService.signOut();
    this.props.history.push('/login');
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

          <Menu signOut={this.signOut} />
        </nav>

        <div className="container-fluid">
          <div className="row justify-content-center">
            <main className="col-10 pt-3" role="main">
              <section className="row">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/login" component={Login} />
                  <Route path="/import-script" component={ImportScript} />
                  <Route exact path="/sheet/:id" component={SheetHome} />
                  <Route exact path="/sheet/:id/compare" component={MonthCompare} />
                  <Route exact path="/sheet/:id/:year-:month" component={MonthDetail} />
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
