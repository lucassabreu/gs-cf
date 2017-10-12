import Loading from '../Loading';
import formatMoney from './formatMoney';

export default function Totals({ loading, movements }) {
  let totals = movements.reduce(
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

  return (
    <Loading loading={loading}>
      <form>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Créditos</label>
          <div className="col-sm-10">
            <input type="text" readonly className="form-control-plaintext"
              value={formatMoney(totals.totalCredit, 2, ',', '.')} />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Débitos</label>
          <div className="col-sm-10">
            <input type="text" readonly className="form-control-plaintext"
              value={formatMoney(totals.totalDebit, 2, ',', '.')} />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Total</label>
          <div className="col-sm-10">
            <input type="text" readonly className="form-control-plaintext"
              value={formatMoney(totals.total, 2, ',', '.')} />
          </div>
        </div>
      </form>
    </Loading>
  );
}