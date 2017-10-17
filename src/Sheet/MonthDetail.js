import Component from 'inferno-component';
import SheetAPIService from '../Google/SheetAPIService';
import Loading from '../Loading';
import Totals from './Totals';
import formatDate from './formatDate';
import formatMoney from './formatMoney';

class MonthDetail extends Component {
  constructor(props, { router }) {
    super(props)
    let { params } = props;


    this.state = {
      sheetId: params.id,
      month: new Date(params.year, params.month - 1),
      loading: true,
      movements: [],
    };

    this.service = new SheetAPIService({
      sheetId: this.state.sheetId,
    });
  }

  async componentWillMount() {
    if (this.state.loading) {
      this.setState({
        loading: false,
        movements: await this.service.getMovements({
          month: this.state.month
        }),
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    let line = (movement) => {
      return (
        <tr>
          <td>{formatDate(movement.date)}</td>
          <td>{movement.category}</td>
          <td>{movement.description}</td>
          <td className="text-right">{formatMoney(movement.value, 2, ',', '.')}</td>
          <td className="text-right">{formatMoney(movement.getValue(), 2, ',', '.')}</td>
          <td>{movement.origin}</td>
        </tr>
      );
    }

    return (
      <div className="col-12">
        <Totals movements={this.state.movements.filter(m => m.getValue() !== 0)} />
        <table className="table table-sm">
          <thead>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th className="text-right" colspan="2">Value</th>
            <th>Origin</th>
          </thead>
          <tbody>
            {this.state.movements.map(line)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MonthDetail;