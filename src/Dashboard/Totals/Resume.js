import React from 'react'
import PropTypes from 'prop-types'
import Sheet from '../../Google/Sheet'
import DashboardByFilter from './DashboardByFilter';

const Resume = ({ sheet }) => <DashboardByFilter sheet={sheet} filter={{}} />

Resume.propTypes = {
  sheet: PropTypes.instanceOf(Sheet)
}

export default Resume