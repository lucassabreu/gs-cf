import React from 'react';
import PropTypes from 'prop-types';

import formatDate from './formatDate';
import formatMoney from './formatMoney';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

let CustomTooltip = ({ active, payload, label }) => {
  if (active === false) {
    return null;
  }

  return (
    <div className="custom-tooltip">
      <p className="label">
        {formatDate(payload[0].payload.date)}: {formatMoney(payload[0].value, 2, ',', '.')}
      </p>
    </div>
  );
}

const Compare = ({ movements, startMonth, endMonth }) => {
  let data = movements.filter(m => m.getValue() !== 0);

  return (
    <LineChart width={600} height={300} data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="id" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
}

Compare.propTypes = {
  movements: PropTypes.array,
  startMonth: PropTypes.any,
  endMonth: PropTypes.any,
}

export default Compare;