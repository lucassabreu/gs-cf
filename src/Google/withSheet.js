import React from 'react';
import getDisplayName from '../getDisplayName'
import { withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'

const withSheet = (getSheet) => (WrappedComponent) => {
  const WithSheet = ({ location, ...restProps }) => {
    const match = matchPath(location.pathname, '/sheet/:id');
    const sheetId = match ? match.params.id : "";

    let sheet = null;
    if (sheetId) {
      sheet = getSheet(sheetId);
    }

    return <WrappedComponent sheet={sheet} match={match} {...restProps} />
  }
  WithSheet.displayName = `WithSheet(${getDisplayName(WrappedComponent)})`
  return withRouter(WithSheet);
}

export default withSheet;