import React from 'react';
import { NavItem, NavLink } from 'reactstrap';

export default ({ id, activeTab, toogle, children }) => (
  <NavItem>
    <NavLink active={activeTab === id} onClick={() => toogle(id)} href="#">
      {children}
    </NavLink>
  </NavItem>
)