import React from 'react';
import formatMoney from './formatMoney';
import PropTypes from 'prop-types';

const extract = hashMap => {
  let values = [];
  for (var key in hashMap) {
    values.push(hashMap[key]);
  }
  return values;
};

function CategoryTotalsByMonth({ movements }) {
  let hashMap = movements.reduce((r, m) => {
    if (r[m.category] === undefined) {
      r[m.category] = {
        category: m.category,
        value: 0,
        months: {},
      };
    }

    r[m.category].value += m.value;

    const monthKey = m.getMonth().toISOString().substring(0, 10);
    if (r[m.category].months[monthKey] === undefined) {
      r[m.category].months[monthKey] = {
        month: m.getMonth(),
        value: 0,
      }
    }

    r[m.category].months[monthKey].value += m.value;

    return r;
  }, {});

  let categories = extract(hashMap)
    .map(c => {
      c.months = extract(c.months).sort((p, n) => p.value - n.value);
      c.avg = c.months.reduce((r, m) => r + (m.value / c.months.length), 0)
      c.median = c.months[parseInt(c.months.length / 2)].value;
      return c;
    })
    .sort((n, p) => Math.abs(p.value) - Math.abs(n.value));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Categoria</th>
          <th className="text-right">Valor</th>
          <th className="text-right">Média</th>
          <th className="text-right">Mediana</th>
        </tr>
      </thead>
      <tbody>
        {categories.map(c => (
          <tr key={c.category}>
            <td>{c.category}</td>
            <td className="text-right">{formatMoney(c.value, 2, ',', '.')}</td>
            <td className="text-right">{formatMoney(c.avg, 2, ',', '.')}</td>
            <td className="text-right">{formatMoney(c.median, 2, ',', '.')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

CategoryTotalsByMonth.propTypes = {
  movements: PropTypes.array,
}

export default CategoryTotalsByMonth