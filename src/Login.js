import React, { Component } from 'react';
import GoogleAPIService from './Google/GoogleAPIService';

class Login extends Component {
  constructor(props, { router }) {
    super(props);
    this.state = {
      router: router,
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
      this.state.router.push('/')
    }
  }

  render() {
    return (
      <button onClick={this.signIn} className="btn btn-primary">Login</button>
    );
  }
}

export default Login