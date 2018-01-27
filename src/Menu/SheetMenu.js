import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'

const SheetMenu = ({ location, className }) => {
  const match = matchPath(location.pathname, '/sheet/:id');
  const sheetId = match ? match.params.id : null;

  const importScript = { url: '/import-script', name: 'Import Script' };

  const itens = !sheetId ? [importScript] : [
    { url: `/sheet/${sheetId}`, name: "Resume" },
    { url: `/sheet/${sheetId}/compare`, name: "Compare" },
    importScript
  ];

  return (
    <ul className={`navbar-nav ${className}`}>
      {itens.map(({ url, name }) => (
        <li key={url} className={`nav-item ${url === location.pathname ? 'active' : ''}`}>
          <Link className="btn nav-link" to={url}>{name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default withRouter(SheetMenu)