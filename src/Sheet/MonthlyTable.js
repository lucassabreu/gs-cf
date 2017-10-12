import formatMoney from './formatMoney';
import formatDate from './formatDate';
import Loading from '../Loading';
import './MonthlyTable.css'

export default function MonthlyTable({ className, loading, months }) {
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
              </tr>
            )
          })}
        </tbody>
      </table>
    </Loading>
  );
}