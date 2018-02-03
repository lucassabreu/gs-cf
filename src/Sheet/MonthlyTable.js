import React from 'react';
import formatMoney from './formatMoney';
import formatDate from './formatDate';
import Loading from '../Loading';
import './MonthlyTable.css'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const yearMonth = (date) => date.getFullYear() + '-' + (date.getMonth() > 9 ? '0' : '') + (date.getMonth() + 1)

function MonthlyTable({ className, loading, months, sheetId }) {
  if (loading) {
    return <Loading />
  }

  months = months.concat().sort((p, n) => n.month - p.month);
  return (
    <div className="table-responsive">
      <table className={className + " monthlyTable table table-sm"}>
        <thead>
          <tr>
            <th>Month</th>
            <th className="text-right">Initial</th>
            <th className="text-right">Credit</th>
            <th className="text-right">Debt</th>
            <th className="text-right">Balance</th>
            <th className="text-right">Final</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {months.filter(m => m).map((m) => {
            const lineColor = m.balance > 0 ? 'lineGreen' : 'lineRed';
            return (
              <tr key={m.month} className={lineColor}>
                <td>{formatDate(m.month)}</td>
                <td className="text-right">{formatMoney(m.initial, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.credit, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.debt, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.balance, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.final, 2, ',', '.')}</td>
                <td>
                  <Link to={`/sheet/${sheetId}/${yearMonth(m.month)}`}>
                    <i className="material-icons">list</i>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

MonthlyTable.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  months: PropTypes.array,
  sheetId: PropTypes.string,
}

export default MonthlyTable