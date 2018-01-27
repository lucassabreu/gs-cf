import React from 'react'
import Navbar from '../Menu/Navbar';

const MenuLayout = ({ user, isSignedIn, children }) => (
  <div>
    <Navbar user={user} isSignedIn={isSignedIn} />
    {children}
  </div>
)

export default MenuLayout