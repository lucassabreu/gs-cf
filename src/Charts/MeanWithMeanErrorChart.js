import React from 'react'
import PropTypes from 'prop-types'
import { getRows } from './getRows'

/**
 * todo: https://explorable.com/standard-error-of-the-mean
 * https://explorable.com/measurement-of-uncertainty-standard-deviation
 * https://explorable.com/calculate-standard-deviation
 */

/**
 * @param {Number} values
 * @returns {Object}
 */
const meanAndError = (values) => {
  return 0;
}

const MeanWithMeanErrorChart = ({ noBorders, className, data, label, values, dataKey: key, valueLabel }) => {
  const rows = getRows({ data, label, key, value: values })
    .map((v) => {
      return Object.assign(v, {
        mean: 0,
      })
    })
}

MeanWithMeanErrorChart.defaultProps = {
  noBorders: false,
  className: "",
}

MeanWithMeanErrorChart.propTypes = {
  noBorders: PropTypes.bool,
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.oneOf([PropTypes.string, PropTypes.func]).isRequired,
  values: PropTypes.oneOf([PropTypes.string, PropTypes.func]).isRequired,
  dataKey: PropTypes.oneOf([PropTypes.string, PropTypes.func]).isRequired,
  valueLabel: PropTypes.func,
}