import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

const NavSimpleItem = ({ id, activeTab, toogle, children }) => (
  <NavItem>
    <NavLink active={activeTab === id} onClick={() => toogle(id)} href="#">
      {children}
    </NavLink>
  </NavItem>
);

NavSimpleItem.propTypes = {
  id: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  toogle: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
}

export default NavSimpleItem