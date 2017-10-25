import React from 'react';
import PropTypes from 'prop-types';

import formatDate from './formatDate';
import formatMoney from './formatMoney';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active === false || payload === null) {
    return null;
  }

  let data = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <strong>{formatDate(data.date)}:</strong>
      <dl>
        <dt>Balanço:</dt>
        <dd>{formatMoney(data["Balanço"], 2, ',', '.')}</dd>
        <dt>Acumulado:</dt>
        <dd>{formatMoney(data["Acumulado"], 2, ',', '.')}</dd>
      </dl>
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.any),
}

const activeDot = { r: 8 };
const Chart = ({ title, data }) => (
  <div className="card mb-3">
    <div className="card-header">{title}</div>
    <div className="card-body">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <XAxis dataKey="key" />
          <YAxis />

          <Area type="monotone" dataKey="Balanço" stroke="#8884d8"
            activeDot={activeDot} fill="#8884d8" />
          <Area type="monotone" dataKey="Acumulado" stroke="#82ca9d"
            activeDot={activeDot} fill="#82ca9d" />

          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
)

Chart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.date,
    Balanço: PropTypes.number,
    Acumulado: PropTypes.number,
  })),
}

class Compare extends React.PureComponent {
  static propTypes = {
    movements: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.date,
      value: PropTypes.number,
      getValue: PropTypes.func,
    })),
    months: PropTypes.array,
  }

  render() {
    let { movements, months } = this.props;

    const extract = (hash) => {
      let data = [];
      for (let key in hash) {
        data.push(hash[key]);
      }
      return data;
    }

    let data = extract(
      movements.reduce(
        (r, c) => {
          let key = formatDate(c.date);
          if (r[key] === undefined) {
            r[key] = {
              date: c.date,
              "Balanço": 0,
              key: key,
            }
          }

          r[key]["Balanço"] += c.value;
          return r;
        },
        {}
      )
    );

    let startMonthTotal = months.slice(0, 1).pop()
    let runSum = startMonthTotal.initial;
    data = data.sort((p, n) => p.date - n.date).map(d => {
      d["Acumulado"] = runSum += d["Balanço"];
      return d;
    });

    let monthsData = months.map(m => ({
      date: m.month,
      "Balanço": m.balance,
      Acumulado: m.final,
    }))
      .sort((p, n) => p.date - n.date);

    return (
      <div>
        <Chart title="Meses" data={monthsData} />
        <Chart title="Diário" data={data} />
      </div>
    );
  }
}

export default Compare;