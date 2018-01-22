import React from 'react'
import { matchPath } from 'react-router'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

const Menu = ({ location, isSignedIn, user, signOut }) => {
  let match = matchPath(location.pathname, '/sheet/:id');
  let sheetId = match ? match.params.id : "";

  return (
    <div className="collapse navbar-collapse" id="navbars">
      <ul className="navbar-nav mr-auto">
        {isSignedIn ? null :
          <li className="nav-item">
            <Link className="btn nav-link" to="/login">Login</Link>
          </li>
        }
        {sheetId.length === 0 ? null :
          <li className="nav-item">
            <Link className="btn nav-link" to={`/sheet/${sheetId}/compare`}>Compare</Link>
          </li>
        }
        <li className="nav-item">
          <Link className="btn nav-link" to="/import-script">Import Script</Link>
        </li>
        {!isSignedIn ? null :
          <li className="nav-item">
            <span className="btn nav-link" onClick={signOut}>Logout</span>
          </li>
        }
      </ul>
    </div>
  )
}

Menu.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  signOut: PropTypes.func.isRequired,
}

export default withRouter(Menu);