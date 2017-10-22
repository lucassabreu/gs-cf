import React, { Component } from 'react';
import GoogleAPIService from './Google/GoogleAPIService';
import PropTypes from 'prop-types';

class Login extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      history: props.history,
    };

    this.signIn = this.signIn.bind(this);
    this.listenOnSignedIn = this.listenOnSignedIn.bind(this);
  }

  componentWillMount() {
    GoogleAPIService.listenOnIsSignedIn(this.listenOnSignedIn)
  }

  signIn() {
    GoogleAPIService.signIn();
  }

  listenOnSignedIn(isSignedIn) {
    if (isSignedIn === true) {
      this.state.history.push('/')
    }
  }

  render() {
    return (
      <button onClick={this.signIn} className="btn btn-primary">Login</button>
    );
  }
}

export default Login