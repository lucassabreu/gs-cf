import React from 'react';
import { Redirect } from 'react-router-dom';

const Login = ({ signIn, isSignedIn, location }) => {
  if (isSignedIn) {
    let backTo = location.state ? location.state.from : '/';
    return <Redirect to={backTo} />
  }

  return <button onClick={() => signIn()} className="btn btn-primary">Login</button>;
}

export default Login