export default function reduceMovements(movements) {
  return movements.reduce(
    (r, m) => {
      r.total += m.value;
      if (m.value < 0) {
        r.totalDebit -= m.value;
        return r;
      }

      r.totalCredit += m.value;
      return r;
    },
    {
      totalDebit: 0,
      totalCredit: 0,
      total: 0,
    }
  );
}