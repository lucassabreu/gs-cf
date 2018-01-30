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
  const stdDev = Math.sqrt(values.reduce((c, v) => c + ((v - mean) ^ 2), 0) / (values.length - 1))

  return {
    error: stdDev / Math.sqrt(values.length),
    mean: mean
  };
}

const MeanWithMeanErrorChart = ({ noBorders, className, data, label, values, dataKey: key, valueLabel }) => {
  const rows = getRows({ data, label, key, value: values })
    .map(v => Object.assign(v, meanAndError(v.value)))
    .map(v => Object.assign(v, { estimatedMax: v.mean * (1 + v.error), estimatedMin: v.mean * (1 - v.error) }))
    .map(v => {
      v.positive = v.mean > 0;
      if (v.positive) {
        return v;
      }

      v.estimatedMin *= -1;
      v.mean *= -1;
      v.estimatedMax *= -1;
      return v;
    });

  const max = rows.reduce((c, v) => c < v.estimatedMax ? v.estimatedMax : c, 0);

  return (
    <ListGroup flush={noBorders} className={className}>
      {rows.map(({ key, label, positive, valueLabel, estimatedMax, mean, estimatedMin }) => (
        <ListGroupItem key={key}>
          {label} {valueLabel}
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
