import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

export class Private extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      isSignedIn: await loginSubscriber.isSignedIn(),
      user: await loginSubscriber.getUser(),
    };
  }

  componentDidMount() {
    this.props.loginSubscriber.addLoginListener(this.handleChange);
  }

  componentWillUnmount() {
    this.props.loginSubscriber.removeLoginListener(this.handleChange);
  }

  /**
   * @param {Object} param
   * @param {Boolean} param.isSignedIn
   * @param {User} param.user
   */
  handleChange({ isSignedIn, user }) {
    if (this.state.isSignedIn !== isSignedIn || this.state.user !== user) {
      this.setState({
        isSignedIn: isSignedIn,
        user: user,
      });
    }
  }

  render() {
    let { loginSubscriber, component: Component, render: renderRoute, ...restProps } = this.props;

    if (Component) {
      renderRoute = (props) => <Component {...props} />
    }

    return (
      <Route {...restProps}
        render={(props) => this.state.isSignedIn ?
          renderRoute(Object.assign(props, { user: this.state.user })) :
          <Redirect to="/login" />
        }
      />
    );
  }
}