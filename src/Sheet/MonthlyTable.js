import formatMoney from './formatMoney';
import formatDate from './formatDate';

export default function MonthlyTable({ loading, months }) {
  months = months.sort((n, p) => n.month > p.month)
  console.log(months.slice(1, 3))
  return (
    loading ? <div>Loading...</div> :
      <table className="table table-sm">
        <thead>
          <th>Month</th>
          <th></th>
          <th className="text-right">Balance</th>
        </thead>
        <tbody>
          {months.map((m) => {
            return (
              <tr>
                <td>{formatDate(m.month)}</td>
                <td>{m.month.getTime()}</td>
                <td className="text-right">{formatMoney(m.balance, 2, ',', '.')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
  );
}