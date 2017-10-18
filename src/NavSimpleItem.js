import NavItem from 'inferno-bootstrap/dist/Navigation/NavItem';
import NavLink from 'inferno-bootstrap/dist/Navigation/NavLink';

import classnames from 'classnames';

export default ({ id, activeTab, toogle, children }) => (
  <NavItem>
    <NavLink className={classnames({ active: activeTab === id })}
      onClick={() => toogle(id)} href="#">
      {children}
    </NavLink>
  </NavItem>
)