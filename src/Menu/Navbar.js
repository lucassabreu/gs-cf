import React from 'react'
import UserMenu from './UserMenu';
import SheetMenu from './SheetMenu';
import { Link } from 'react-router-dom'

const Navbar = ({ user, isSignedIn }) => (
  <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <Link to="/" className="navbar-brand">GS CF</Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbars"
      aria-controls="navbars" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse justify-content-between" id="navbars">
      <SheetMenu />
      {!isSignedIn ? null : <UserMenu user={user} />}
    </div>
  </nav>
)

export default Navbar