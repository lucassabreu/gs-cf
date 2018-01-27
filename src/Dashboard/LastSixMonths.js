import React from 'react'
import PropTypes from 'prop-types'
import Sheet from '../Google/Sheet'
import DashboardByFilter from './DashboardByFilter';

let sixMonthsAgo = new Date;
sixMonthsAgo.setDate(0)
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
const LastSixMonths = ({ sheet }) => <DashboardByFilter sheet={sheet} filter={{ start: sixMonthsAgo }} />

LastSixMonths.propTypes = {
  sheet: PropTypes.instanceOf(Sheet)
}

export default LastSixMonths
export { sixMonthsAgo }