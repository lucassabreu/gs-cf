import React from 'react'
import { Link } from 'react-router-dom'

const UserMenu = ({ user, className }) => (
  <ul className={`navbar-nav ${className}`} style={{ flexDirection: "row", justifyContent: "space-around" }}>
    <li className="nav-item">
      <span className="nav-link" style={{ paddingBottom: 0, paddingTop: ".3rem", textAlign: "center" }}>
        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {user.name}
        </span>
        <img style={{ marginLeft: "1ex" }} src={user.image} width="30" height="30" alt="" />
      </span>
    </li>
    <li className="nav-item">
      <Link className="btn nav-link" to='/logout'>Logout</Link>
    </li>
  </ul>
)

UserMenu.defaultProps = { className: "" }

export default UserMenu