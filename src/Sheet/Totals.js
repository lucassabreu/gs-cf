import React from 'react';
import Loading from '../Loading';
import formatMoney from './formatMoney';
import reduceMovements from './reduceMovements';
import PropTypes from 'prop-types';

function Totals({ loading, movements, className }) {
  let totals = reduceMovements(movements);

  if (loading) {
    return <Loading />
  }

  return (
    <form className={"row " + className} style={{ textAlign: 'center' }}>
      <div className="col-4">
        <div className="form-group">
          <label className="col-form-label"><strong>Créditos</strong></label>
          <div>{formatMoney(totals.totalCredit, 2, ',', '.')}</div>
        </div>
      </div>
      <div className="col-4">
        <div className="form-group">
          <label className="col-form-label"><strong>Débitos</strong></label>
          <div>{formatMoney(totals.totalDebit, 2, ',', '.')}</div>
        </div>
      </div>
      <div className="col-4">
        <div className="form-group">
          <label className="col-form-label"><strong>Total</strong></label>
          <div>{formatMoney(totals.total, 2, ',', '.')}</div>
        </div>
      </div>
    </form>
  );
}

Totals.propTypes = {
  loading: PropTypes.bool,
  movements: PropTypes.array,
  className: PropTypes.string,
}

export default Totals