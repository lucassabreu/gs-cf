import React from 'react'
import PropTypes from 'prop-types'
import { getRows } from './getRows'
import { UncontrolledTooltip, ListGroupItemText, Progress, ListGroupItem, ListGroup } from 'reactstrap';

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

/**
 * @param {Number} value
 */
const money = (value) => `R$ ${value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`

const StackedBar = ({ children }) => (
  <div className="progress" children={children} />
)

const Bar = ({ value, className, color, min, max, ...attributes }) => (
  <div {...attributes} role="progressbar" style={{ width: `${(value * 100) / max}%` }} aria-valuenow={value}
    aria-valuemin={min} aria-valuemax={max} className={`progress-bar bg-${color} ${className}`} />
)

Bar.defaultProps = {
  min: 0,
  max: 100,
  color: 'default',
  className: '',
}

const normalizeId = (id) => id.replace(/[^a-zA-Z_:.-]/g, '_')

const MeanWithMeanErrorChart = ({ id, noBorders, className, data, label, values, dataKey: key, valueLabel }) => {
  const rows = getRows({ data, label, key, value: values })
    .map(v => Object.assign(v, meanAndError(v.value)))
    .filter(v => v.mean !== 0)
    .map(v => {
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
          {label} {money(mean)} {money(error)}
          <StackedBar>
            <Bar id={normalizeId(`${id}_${key}_min`)} max={max} value={estimatedMin} />
            <Bar id={normalizeId(`${id}_${key}_mean`)} max={max} value={error} color={'warning'} />
            <Bar id={normalizeId(`${id}_${key}_max`)} max={max} value={error} color={'info'} />
          </StackedBar>
          <UncontrolledTooltip placement="top" target={normalizeId(`${id}_${key}_min`)}
            children={money(estimatedMin)} />
          <UncontrolledTooltip placement="top" target={normalizeId(`${id}_${key}_mean`)}
            children={money(mean)} />
          <UncontrolledTooltip placement="top" target={normalizeId(`${id}_${key}_max`)}
            children={money(estimatedMax)} />
        </ListGroupItem>
      ))}
    </ListGroup>
  )
}

MeanWithMeanErrorChart.defaultProps = {
  id: "MeanWithMeanErrorChart",
  noBorders: false,
  className: "",
}

MeanWithMeanErrorChart.propTypes = {
  id: PropTypes.string,
  noBorders: PropTypes.bool,
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  values: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  valueLabel: PropTypes.func,
}

export default MeanWithMeanErrorChart
