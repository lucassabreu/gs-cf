import React from 'react'
import { Link } from 'react-router-dom'

const UserMenu = ({ user, className }) => (
  <ul className={`navbar-nav ${className}`}>
    <li className="nav-item hidden-sm">
      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} className="nav-link">{user.name}</span>
    </li>
    <li className="nav-item">
      <span className="nav-link" style={{ paddingBottom: 0, paddingTop: ".3rem" }}>
        <img src={user.image} width="30" height="30" alt="" />
      </span>
    </li>
    <li className="nav-item">
      <Link className="btn nav-link" to='/logout'>Logout</Link>
    </li>
  </ul>
)

export default UserMenu