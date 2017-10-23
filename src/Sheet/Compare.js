import React from 'react';
import PropTypes from 'prop-types';

import formatDate from './formatDate';
import formatMoney from './formatMoney';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
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
  let hashMap = movements.filter(m => m.getValue() !== 0).reduce(
    (r, c) => {
      let key = formatDate(c.date);
      if (r[key] === undefined) {
        r[key] = {
          date: c.date,
          value: 0,
          key: key,
        }
      }

      r[key].value += c.value;
      return r;
    },
    {}
  );

  let data = [];
  for (var key in hashMap) {
    data.push(hashMap[key]);
  }

  let runSum = 0;
  data = data.sort((p, n) => p.date - n.date).map(d => {
    runSum += d.value;
    d.runSum = runSum;
    return d;
  });

  return (
    <LineChart width={800} height={400} data={data}>
      <XAxis dataKey="key" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="runSum" stroke="#ccc" activeDot={{ r: 8 }} />
    </LineChart>
  );
}

Compare.propTypes = {
  movements: PropTypes.array,
  startMonth: PropTypes.any,
  endMonth: PropTypes.any,
}

export default Compare;