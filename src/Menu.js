import React from 'react'
import { matchPath } from 'react-router'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

const Menu = ({ location, signOut }) => {
  let match = matchPath(location.pathname, '/sheet/:id');
  let sheetId = match ? match.params.id : "";
  return (
    <div className="collapse navbar-collapse" id="navbars">
      <ul className="navbar-nav mr-auto">
        {sheetId.length === 0 ? null :
          <li className="nav-item">
            <Link className="btn nav-link" to={`/gs-cf/sheet/${sheetId}/compare`}>Compare</Link>
          </li>
        }
        <li className="nav-item">
          <Link className="btn nav-link" to="/gs-cf/import-script">Import Script</Link>
        </li>
        <li className="nav-item">
          <span className="btn nav-link" onClick={signOut}>Logout</span>
        </li>
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