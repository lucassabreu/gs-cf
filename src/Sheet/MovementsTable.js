import React from 'react';
import PropTypes from 'prop-types';

import formatDate from './formatDate';
import formatMoney from './formatMoney';

import './MovementsTable.css';

const MovementsTable = ({ firstMonth, movements }) => {
  let runSum = firstMonth.initial;
  let dailyRunSum = 0;
  let lastDate = null;
  let dayCount = 0;

  let line = (movement) => {
    if (lastDate === null || lastDate.getTime() !== movement.date.getTime()) {
      dayCount++;
      lastDate = movement.date;
      dailyRunSum = 0;
    }

    runSum += movement.value;
    dailyRunSum += movement.value;
    return (
      <tr key={movement.id} className={dayCount % 2 ? 'even' : 'odd'}>
        <td>{formatDate(movement.date)}</td>
        <td>{movement.category}</td>
        <td>{movement.description}</td>
        <td className="text-right">{formatMoney(movement.value, 2, ',', '.')}</td>
        <td>{movement.origin}</td>
        <td className="text-right">{formatMoney(dailyRunSum, 2, ',', '.')}</td>
        <td className="text-right">{formatMoney(runSum, 2, ',', '.')}</td>
      </tr>
    );
  }

  return (
    <table className="table table-sm MovementsTable">
      <thead>
        <tr>
          <th>Data</th>
          <th>Categoria</th>
          <th>Descrição</th>
          <th className="text-right">Valor</th>
          <th>Origem</th>
          <th colSpan="2" className="text-right">Acumulado</th>
        </tr>
      </thead>
      <tbody>
        {movements.map(line)}
      </tbody>
    </table>
  )
}

MovementsTable.propTypes = {
  firstMonth: PropTypes.shape({
    initial: PropTypes.number,
  }),
  movements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.date,
    category: PropTypes.category,
    description: PropTypes.string,
    origin: PropTypes.string,
    value: PropTypes.number,
  })),
}

export default MovementsTable;