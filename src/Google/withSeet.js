import React from 'react';
import getDisplayName from './getDisplayName'

const withSeet = (getSheet) => (WrappedComponent) => {
  const WithSeet = ({ match, ...restProps }) => {
    let sheet = null;
    if (!props.match.params.sheetId) {
      sheet = getSheet(props.match.params.sheetId);
    }

    return <WrappedComponent sheet={sheet} {...restProps} />
  }
  WithSeet.displayName = `WithSheet(${getDisplayName(WrappedComponent)})`
  return WithSeet;
}

export default withSeet;