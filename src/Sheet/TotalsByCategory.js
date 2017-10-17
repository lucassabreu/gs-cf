import formatMoney from './formatMoney';

export default function TotalsByCategory({ movements }) {
  let hashMap = movements.reduce((r, m) => {
    if (r[m.category] === undefined) {
      r[m.category] = {
        category: m.category,
        value: 0,
      };
    }

    r[m.category].value += m.value;

    return r;
  }, {});

  let categories = [];
  for (var key in hashMap) {
    if (hashMap[key].value === 0) {
      continue;
    }
    categories.push(hashMap[key]);
  }

  categories = categories.sort((n, p) => Math.abs(p.value) - Math.abs(n.value));

  return (
    <table className="table">
      <thead>
        <th>Categoria</th>
        <th className="text-right">Valor</th>
      </thead>
      {categories.map(c => (
        <tr>
          <td>{c.category}</td>
          <td className="text-right">{formatMoney(c.value, 2, ',', '.')}</td>
        </tr>
      ))}
      <tbody>
      </tbody>
    </table>
  );
}