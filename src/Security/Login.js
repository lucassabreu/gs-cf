import React from 'react';
import { Redirect } from 'react-router-dom';
import MainContainer from '../Container/MainContainer';

const Login = ({ signIn, isSignedIn, location }) => {
  if (isSignedIn) {
    let backTo = location.state ? location.state.from : '/';
    return <Redirect to={backTo} />
  }

  return (
    <MainContainer>
      <button onClick={() => signIn()} className="btn btn-primary">Login</button>
    </MainContainer>
  )
}

export default Login