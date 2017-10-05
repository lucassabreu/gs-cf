import formatMoney from './formatMoney';
import formatDate from './formatDate';

export default function MonthlyTable({ className, loading, months }) {
  return (
    loading ? <div>Loading...</div> :
      <table className={className + " table table-sm"}>
        <thead>
          <th>Month</th>
          <th className="text-right">Initial</th>
          <th className="text-right">Credit</th>
          <th className="text-right">Debit</th>
          <th className="text-right">Final</th>
        </thead>
        <tbody>
          {months.map((m) => {
            return (
              <tr>
                <td>{formatDate(m.month)}</td>
                <td className="text-right">{formatMoney(m.initial, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.credit, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.debit, 2, ',', '.')}</td>
                <td className="text-right">{formatMoney(m.final, 2, ',', '.')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
  );
}