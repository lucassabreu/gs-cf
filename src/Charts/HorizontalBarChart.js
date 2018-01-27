import React from 'react';
import { ListGroupItemText, Progress, ListGroupItem, ListGroup } from 'reactstrap';

const getByKey = (key) => (value) => value[key];
const defaultLabel = (key) => (value) => <ListGroupItemText children={value[key]} />
const defaultValueLabel = (valueFn) => (value) => <ListGroupItemText children={Number(valueFn(value)).toLocaleString(undefined, 2)} />

const HorizontalBarChart = ({ noBorders, className, data, label, value, dataKey: key, valueLabel }) => {
  const valueFn = value instanceof Function ? value : getByKey(value);
  const labelFn = label instanceof Function ? label : defaultLabel(label);
  const keyFn = key instanceof Function ? key : getByKey(key);
  valueLabel = valueLabel || defaultValueLabel(valueFn)

  const rows = data
    .map((v) => ({ label: labelFn(v), value: valueFn(v), key: keyFn(v), valueLabel: valueLabel(v) }))
    .map((row) => Object.assign(row, {
      value: Math.abs(row.value),
      positive: row.value > 0,
    }))
  const max = rows.reduce((max, row) => row.value > max ? row.value : max, 0)

  return (
    <ListGroup flush={noBorders} className={className}>
      {rows.map(({ key, value, label, positive, valueLabel }) => (
        <ListGroupItem key={key}>
          {label} {valueLabel}
          <Progress value={value} max={max} color={positive ? 'success' : 'danger'} />
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}

HorizontalBarChart.defaultProps = {
  noBorders: false,
}

export default HorizontalBarChart