export default function reduceMovements(movements) {
  return movements.reduce(
    (r, m) => {
      r.total += m.value;
      if (m.value < 0) {
        r.totalDebt -= m.value;
        return r;
      }

      r.totalCredit += m.value;
      return r;
    },
    {
      totalDebt: 0,
      totalCredit: 0,
      total: 0,
    }
  );
}