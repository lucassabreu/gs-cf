import React from 'react';
import Navbar from '../Menu/Navbar'
import MainContainer from '../Container/MainContainer'

const MainLayout = ({ children, user, isSignedIn }) => (
  <div>
    <Navbar user={user} isSignedIn={isSignedIn} />
    <MainContainer>{children}</MainContainer>
  </div>
)

export default MainLayout
