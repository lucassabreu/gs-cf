import React from 'react'
import { Route, Redirect } from 'react-router-dom';

const Private = ({ isSignedIn, user, component: Component, render: renderRoute, ...restProps }) => {
  if (Component) {
    renderRoute = (props) => <Component {...props} />
  }

  return (
    <Route {...restProps}
      render={(props) => isSignedIn ?
        renderRoute(Object.assign(props, {
          isSignedIn: isSignedIn,
          user: user
        })) :
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      }
    />
  );
}

export default Private