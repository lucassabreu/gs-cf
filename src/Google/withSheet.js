import React from 'react';
import getDisplayName from '../getDisplayName'

const withSheet = (getSheet) => (WrappedComponent) => {
  const WithSheet = ({ match, ...restProps }) => {
    let sheet = null;
    if (!match.params.sheetId) {
      sheet = getSheet(match.params.sheetId);
    }

    return <WrappedComponent sheet={sheet} {...restProps} />
  }
  WithSheet.displayName = `WithSheet(${getDisplayName(WrappedComponent)})`
  return WithSheet;
}

export default withSheet;