import React from 'react';
import GoogleAPIService from './GoogleAPIService';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import Async from 'react-code-splitting'

class AuthorizedOnly extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    children: PropTypes.any.isRequired,
  }

  componentWillMount() {
    GoogleAPIService.listenOnIsSignedIn((isSignedIn) => {
      if (isSignedIn === false) {
        this.props.history.push('/login');
      }
    })
  }

  render() {
    return this.props.children;
  }
}

AuthorizedOnly = withRouter(AuthorizedOnly);

const AuthorizedOnlyAsync = ({ load, componentProps }) => (
  <AuthorizedOnly>
    <Async load={load} componentProps={componentProps} />
  </AuthorizedOnly>
);

AuthorizedOnlyAsync.propTypes = {
  load: PropTypes.any,
  componentProps: PropTypes.any,
};

export {
  AuthorizedOnly,
  AuthorizedOnlyAsync,
}