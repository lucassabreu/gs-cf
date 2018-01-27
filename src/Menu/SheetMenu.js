import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'

/**
 * @param {String} url 
 * @param {String} pathname 
 */
const equals = (url, pathname) => url === pathname;
/**
 * @param {String} url 
 * @param {String} pathname 
 */
const startsWith = (url, pathname) => pathname.startsWith(url);

const SheetMenu = ({ location, className }) => {
  const match = matchPath(location.pathname, '/sheet/:id');
  const sheetId = match ? match.params.id : null;

  const importScript = { url: '/import-script', name: 'Import Script', isActive: equals };

  const itens = !sheetId ? [importScript] : [
    importScript,
    { url: `/sheet/${sheetId}`, name: "Resume", isActive: equals },
    { url: `/sheet/${sheetId}/dashboard`, name: "Dashboard", isActive: startsWith },
    { url: `/sheet/${sheetId}/compare`, name: "Compare", isActive: equals },
  ];

  return (
    <ul className={`navbar-nav ${className}`}>
      {itens.map(({ url, name, isActive }) => (
        <li key={url} className={`nav-item ${isActive(url, location.pathname) ? 'active' : ''}`}>
          <Link className="btn nav-link" to={url}>{name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default withRouter(SheetMenu)