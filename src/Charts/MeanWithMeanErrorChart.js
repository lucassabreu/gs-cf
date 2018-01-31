import React from 'react'
import PropTypes from 'prop-types'
import { getRows } from './getRows'
import { UncontrolledTooltip, ListGroupItemText, Progress, ListGroupItem, ListGroup } from 'reactstrap';
import './MeanWithMeanErrorChart.css'

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

const DefaultValueLabel = ({ mean, error }) => <span>{money(mean - error)} até {money(mean + error)}</span>

const BarWithError = ({ value, error, max, id, tooltip, className, color, ...attributes }) => {
  const tooltips = !tooltip ? null :
    <React.Fragment>
      <UncontrolledTooltip placement="top" target={`${id}_value`} children={money(value)} />
      <UncontrolledTooltip placement="top" target={`${id}_error`}>
        <DefaultValueLabel mean={value} error={error} />
      </UncontrolledTooltip>
    </React.Fragment>;

  const realMax = max || (value + error)
  return (
    <div id={id} className={`BarWithError ${className}`} {...attributes}>
      <div id={`${id}_value`} className={`value bg-${color}`} style={{ width: `${value / realMax * 100}%` }} />
      <div id={`${id}_error`} className="error" style={{
        left: `${(value - error) / realMax * 100}%`,
        width: `${error / realMax * 100 * 2}%`,
      }} />
      {tooltips}
    </div>
  )
}

BarWithError.propTypes = {
  value: PropTypes.number.isRequired,
  error: PropTypes.number.isRequired,
  max: PropTypes.number,
  id: PropTypes.string.isRequired,
  tooltip: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.oneOf(['success', 'info', 'danger', 'warning']),
}

BarWithError.defaultProps = {
  tooltip: false,
  className: "",
  color: "success",
}

const normalizeId = (id) => id.replace(/[^a-zA-Z_:.-]/g, '_')

const MeanWithMeanErrorChart = ({ id, noBorders, className, data, label, values, dataKey: key, valueLabel: ValueLabel, color }) => {
  ValueLabel = ValueLabel || DefaultValueLabel
  const rows = getRows({ data, label, key, value: values })
    .map(v => Object.assign(v, meanAndError(v.value)))
    .filter(v => v.mean !== 0)
    .map(v => {
      v.positive = v.mean > 0;
      v.mean = Math.abs(v.mean)
      v.error = Math.abs(v.error)
      return Object.assign(v, { estimatedMax: v.mean + v.error, estimatedMin: v.mean - v.error })
    })
    .map(v => Object.assign(v, { ValueLabel: ValueLabel(v) }))
    .sort((a, b) => a.mean < b.mean ? 1 : -1)

  const max = rows.reduce((c, v) => c < v.estimatedMax ? v.estimatedMax : c, 0);

  return (
    <ListGroup flush={noBorders} className={className}>
      {rows.map(({ key, error, label, positive, ValueLabel, estimatedMax, mean, estimatedMin }) => (
        <ListGroupItem key={key}>
          {label} {ValueLabel}
          <BarWithError value={mean} error={error} max={max} tooltip color={color}
            id={normalizeId(`${id}_${key}`)} />
        </ListGroupItem>
      ))}
    </ListGroup>
  )
}

MeanWithMeanErrorChart.defaultProps = {
  id: "MeanWithMeanErrorChart",
  noBorders: false,
  className: "",
  valueLabel: DefaultValueLabel,
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
