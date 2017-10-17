import Loading from '../Loading';
import formatMoney from './formatMoney';
import reduceMovements from './reduceMovements';

export default function Totals({ loading, movements }) {
  let totals = reduceMovements(movements);

  if (loading) {
    return <Loading />
  }

  return (
    <form className="row" style={{ textAlign: 'center' }}>
      <div className="col-4">
        <div className="form-group">
          <label className="col-form-label">Créditos</label>
          <div>{formatMoney(totals.totalCredit, 2, ',', '.')}</div>
        </div>
      </div>
      <div className="col-4">
        <div className="form-group">
          <label className="col-form-label">Débitos</label>
          <div>{formatMoney(totals.totalDebit, 2, ',', '.')}</div>
        </div>
      </div>
      <div className="col-4">
        <div className="form-group">
          <label className="col-form-label">Total</label>
          <div>{formatMoney(totals.total, 2, ',', '.')}</div>
        </div>
      </div>
    </form>
  );
}