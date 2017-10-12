import formatMoney from './formatMoney';
import formatDate from './formatDate';
import Loading from '../Loading';
import './MonthlyTable.css'
import { Link } from 'inferno-router';

const yearMonth = (date) => date.getFullYear() + '-' + (date.getMonth() > 9 ? '0' : '') + (date.getMonth() + 1)

export default function MonthlyTable({ className, loading, months, sheetId }) {
  months = months.sort((p, n) => n.month - p.month);
  return (
    <Loading loading={loading}>
      <table className={className + " monthlyTable table"}>
        <thead>
          <th>Month</th>
          <th className="text-right">Initial</th>
          <th className="text-right">Credit</th>
          <th className="text-right">Debit</th>
          <th className="text-right">Balance</th>
          <th className="text-right">Final</th>
          <th></th>
        </thead>
        <tbody>
          {months.map((m) => {
            const lineColor = m.balance > 0 ? 'lineGreen' : 'lineRed';
            return (
              <tr className={lineColor}>
                <td>{formatDate(m.month)}</td>
                <td className="text-right">{formatMoney(m.initial, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.credit, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.debit, 2, ',', '.')}</td>
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
    </Loading>
  );
}