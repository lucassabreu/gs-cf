import React, { Component } from "react";
import getDisplayName from '../getDisplayName'

export default function withUser(loginSubscriber) {
  return (WrappedComponent) => {
    class WithUser extends Component {
      constructor(props) {
        super(props);
        this.listen = this.listen.bind(this);

        this.state = {
          isSignedIn: loginSubscriber.isSignedIn(),
          user: loginSubscriber.getUser(),
        };
      }

      async componentDidMount() {
        await loginSubscriber.addListener(this.listen);
      }

      componentWillUnmount() {
        loginSubscriber.removeListener(this.listen);
      }

      /**
       * @param {Object} param
       * @param {Boolean} param.isSignedIn
       * @param {User} param.user
       */
      listen({ isSignedIn, user }) {
        if (this.state.isSignedIn !== isSignedIn || this.state.user !== user) {
          this.setState({
            isSignedIn: isSignedIn,
            user: user,
          });
        }
      }

      render() {
        return <WrappedComponent isSignedIn={this.state.isSignedIn} user={this.state.user} {...this.props} />;
      }
    }
    WithUser.displayName = `WithUser(${getDisplayName(WrappedComponent)})`;
    return WithUser
  }
}