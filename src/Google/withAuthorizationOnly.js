import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
 * Returns a Route that needs to be authorized to acess, and subscribes to login updates
 * @param {*} WrappedComponent 
 * @param {*} googleApiService 
 */
export function withAuthorizationOnly(WrappedComponent, googleApiService) {
  class WithAuthorizationOnly extends Component {
    static propTypes = {
      history: PropTypes.shape({
        push: PropTypes.func,
      }),
      children: PropTypes.any.isRequired,
    }

    constructor(props) {
      super(props);
    }

    handleChange(isSignedIn) {
      if (isSignedIn === false) {
        this.setState({ isSignedIn: false });
        return
      }
    }

    render() {
      if (this.state.isSignedIn === false) {
        return <Redirect to="/login" />
      }

      return <WrappedComponent {...this.props} />
    }

  };



  WithAuthorizationOnly.displayName = `WithAuthorizationOnly(${getDisplayName(WrappedComponent)})`;
  return withRouter(WithAuthorizationOnly)
}