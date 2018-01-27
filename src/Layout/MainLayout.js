import React from 'react';
import MainContainer from '../Container/MainContainer'
import MenuLayout from './MenuLayout';

const MainLayout = ({ children, user, isSignedIn }) => (
  <MenuLayout user={user} isSignedIn={isSignedIn}>
    <MainContainer>{children}</MainContainer>
  </MenuLayout>
)

export default MainLayout
