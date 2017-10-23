import React from 'react';
import PropTypes from 'prop-types';

import formatDate from './formatDate';
import formatMoney from './formatMoney';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active === false) {
    return null;
  }

  if (payload === null) {
    return null;
  }

  let data = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <strong>{formatDate(data.date)}:</strong>
      <dl>
        <dt>Valor:</dt>
        <dd>{formatMoney(data["Valor"], 2, ',', '.')}</dd>
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
  <div className="card">
    <div className="card-header">{title}</div>
    <div className="card-body">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <XAxis dataKey="key" />
          <YAxis />

          <Area type="monotone" dataKey="Valor" stroke="#8884d8"
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
      movements.filter(m => m.getValue() !== 0).reduce(
        (r, c) => {
          let key = formatDate(c.date);
          if (r[key] === undefined) {
            r[key] = {
              date: c.date,
              "Valor": 0,
              key: key,
            }
          }

          r[key]["Valor"] += c.value;
          return r;
        },
        {}
      )
    );

    let startMonthTotal = months.slice(0, 1).pop()
    let runSum = startMonthTotal.initial;
    data = data.sort((p, n) => p.date - n.date).map(d => {
      d["Acumulado"] = runSum += d["Valor"];
      return d;
    });

    let monthsData = extract(
      data.reduce(
        (r, c) => {
          let key = (c.date.getFullYear() * 1000) + c.date.getMonth();
          if (r[key] === undefined) {
            r[key] = {
              date: new Date(c.date.getFullYear(), c.date.getMonth(), 1),
              Valor: 0,
            }
          }

          r[key].Valor += c.Valor;
          return r;
        },
        {}
      )
    );

    runSum = 0;
    monthsData = monthsData.map(m => {
      runSum += m.Valor;
      m.Acumulado = runSum;
      return m;
    });

    return (
      <div>
        <Chart title="Meses" data={monthsData} />
        <Chart title="Diário" data={data} />
      </div>
    );
  }
}

export default Compare;