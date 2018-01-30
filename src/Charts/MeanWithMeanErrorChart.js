import React from 'react'
import PropTypes from 'prop-types'
import { getRows } from './getRows'
import { ListGroupItemText, Progress, ListGroupItem, ListGroup } from 'reactstrap';

/**
 * todo: https://explorable.com/standard-error-of-the-mean
 * https://explorable.com/measurement-of-uncertainty-standard-deviation
 * https://explorable.com/calculate-standard-deviation
 */

/**
 * @param {Number[]} values
 * @returns {Object}
 */
const meanAndError = (values) => {
  if (values.length <= 1) {
    return { mean: 0, error: 0 };
  }

  const mean = values.reduce((c, v) => c + v, 0) / values.length
  const stdDev = Math.sqrt(values.reduce((c, v) => c + Math.pow(v - mean, 2), 0) / (values.length - 1))

  return {
    error: stdDev / Math.sqrt(values.length),
    mean: mean
  };
}

const MeanWithMeanErrorChart = ({ noBorders, className, data, label, values, dataKey: key, valueLabel }) => {
  const rows = getRows({ data, label, key, value: values })
    .map(v => Object.assign(v, meanAndError(v.value)))
    .filter(v => v.mean !== 0)
    .map(v =>  {
      v.positive = v.mean > 0;
      v.mean = Math.abs(v.mean)
      v.error = Math.abs(v.error)
      return Object.assign(v, { estimatedMax: v.mean + v.error, estimatedMin: v.mean - v.error })
    })
    .sort((a, b) => a.mean < b.mean ? 1 : -1)

  const max = rows.reduce((c, v) => c < v.estimatedMax ? v.estimatedMax : c, 0);

  return (
    <ListGroup flush={noBorders} className={className}>
      {rows.map(({ key, error, label, positive, valueLabel, estimatedMax, mean, estimatedMin }) => (
        <ListGroupItem key={key}>
          {label} {Number(mean).toLocaleString(undefined, 2)}
          <Progress value={estimatedMax} max={max} color={positive ? 'success' : 'danger'} />
          <Progress value={mean} max={max} color={positive ? 'success' : 'danger'} />
          <Progress value={estimatedMin} max={max} color={positive ? 'success' : 'danger'} />

        </ListGroupItem>
      ))}
    </ListGroup>
  )
}

MeanWithMeanErrorChart.defaultProps = {
  noBorders: false,
  className: "",
}

MeanWithMeanErrorChart.propTypes = {
  noBorders: PropTypes.bool,
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  values: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  valueLabel: PropTypes.func,
}

export default MeanWithMeanErrorChart
