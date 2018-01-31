import React from 'react'
import { withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'
import ActiveLinkList, { equals, startsWith } from './ActiveLinkList'

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
      <ActiveLinkList itens={itens} pathname={location.pathname} />
      <li className="nav-item">
        <a className="btn nav-link" href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
          target="_blank">
          Open On Google Drive
        </a>
      </li>
    </ul>
  )
}

SheetMenu.defaultProps = { className: "" }

export default withRouter(SheetMenu)