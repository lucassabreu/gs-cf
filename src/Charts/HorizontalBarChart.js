import React from 'react';
import { ListGroupItemText, Progress, ListGroupItem, ListGroup } from 'reactstrap';
import { getRows } from './getRows'

const defaultValueLabel = ({ value }) => (
  <ListGroupItemText children={Number(value).toLocaleString(undefined, 2)} />
);

const HorizontalBarChart = ({ noBorders, className, data, label, value, dataKey: key, valueLabel }) => {
  valueLabel = valueLabel || defaultValueLabel

  const rows = getRows({ data, label, value, key, valueLabel })
    .map((row) => Object.assign(row, {
      value: Math.abs(row.value),
      positive: row.value > 0,
      valueLabel: valueLabel(row),
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