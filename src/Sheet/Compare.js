import React from 'react';
import PropTypes from 'prop-types';

import formatDate from './formatDate';
import formatMoney from './formatMoney';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active === false) {
    return null;
  }

  let data = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <p className="label">
        Valor ({formatDate(data.date)}): {formatMoney(data["Valor Movimento"], 2, ',', '.')}
      </p>
      <p className="label">
        Acumulado ({formatDate(data.date)}): {formatMoney(data["Acumulado"], 2, ',', '.')}
      </p>
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.any),
}

const Compare = ({ movements, months }) => {
  let hashMap = movements.filter(m => m.getValue() !== 0).reduce(
    (r, c) => {
      let key = formatDate(c.date);
      if (r[key] === undefined) {
        r[key] = {
          date: c.date,
          "Valor Movimento": 0,
          key: key,
        }
      }

      r[key]["Valor Movimento"] += c.value;
      return r;
    },
    {}
  );

  let data = [];
  for (var key in hashMap) {
    data.push(hashMap[key]);
  }

  let startMonthTotal = months.slice(0, 1).pop()
  let runSum = startMonthTotal.initial;
  data = data.sort((p, n) => p.date - n.date).map(d => {
    runSum += d["Valor Movimento"];
    d["Acumulado"] = runSum;
    return d;
  });

  return (
    <LineChart width={1000} height={400} data={data}>
      <XAxis dataKey="key" />
      <YAxis />

      <Line type="monotone" dataKey="Valor Movimento" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="Acumulado" stroke="#ccc" activeDot={{ r: 8 }} />

      <CartesianGrid strokeDasharray="3 3" />
      <Legend />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );
}

Compare.propTypes = {
  movements: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.date,
    value: PropTypes.number,
    getValue: PropTypes.func,
  })),
  months: PropTypes.array,
}

export default Compare;