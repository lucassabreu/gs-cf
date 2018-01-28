import React, { Fragment } from 'react'
import './Dashboard.css'
import MainContainer from '../Container/MainContainer';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom'
import ActiveLinkList, { equals } from '../Menu/ActiveLinkList'
import Resume from './Totals/Resume';
import LastSixMonths from './Totals/LastSixMonths';

const renderWithSheet = (sheet, Component) => (props) => <Component sheet={sheet} {...props} />

const Menu = ({ baseUrl, pathname }) => {

  const itens = [
    { url: `${baseUrl}/resume`, name: "Resume", isActive: equals },
    { url: `${baseUrl}/last-six-months`, name: "Last Six Months", isActive: equals },
  ];

  return (
    <div className="nav-scroller py-1 mb-2">
      <nav className="nav d-flex">
        <ActiveLinkList itens={itens} pathname={pathname} render={({ name, url, active }) => (
          <Link key={url} className={`nav-link p-2 text-muted ${active ? 'active' : ''}`} to={url}>{name}</Link>
        )} />
      </nav>
    </div>
  )
}

const Dashboard = ({ sheet, match, location }) => {
  if (!sheet) {
    return <Redirect to="/" />
  }

  return (
    <Fragment>
      <Menu baseUrl={match.url} pathname={location.pathname} />
      <MainContainer>
        <Switch>
          <Route exact path={`${match.url}/resume`} render={renderWithSheet(sheet, Resume)} />
          <Route exact path={`${match.url}/last-six-months`} render={renderWithSheet(sheet, LastSixMonths)} />
          <Redirect exact from={match.url} to={`${match.url}/resume`} />
        </Switch>
      </MainContainer>
    </Fragment>
  )
}

export default withRouter(Dashboard)