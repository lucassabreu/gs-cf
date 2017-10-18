import Component from 'inferno-component';
import SheetAPIService from '../Google/SheetAPIService';
import Loading from '../Loading';
import Totals from './Totals';
import TotalsByCategory from './TotalsByCategory';

const STATE = {
  NOT_LOADED: 0,
  LOADING: 1,
  LOADED: 2,
};

class MonthCompare extends Component {
  constructor(props) {
    super(props)

    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);

    this.state = {
      sheetId: props.params.id,
      loading: STATE.NOT_LOADED,
      startDate: today,
      endDate: today,
      movements: [],
    };

    this.service = new SheetAPIService({
      sheetId: this.state.sheetId,
    });

    this.loadData = this.loadData.bind(this);
  }

  async loadData(event) {
    event.preventDefault();

    this.setState({ loading: STATE.LOADING });

    let months = await this.service.getMonthTotals(this.state.startDate, this.state.endDate)
      .sort((n, p) => n.month - p.month);

    let endMonthTotal = months.pop();
    let startMonthTotal = months.pop();

    this.setState({
      movements: await this.service.getMovements({
        start: this.state.startDate,
        end: this.state.endDate,
      }),
      startMonthTotal: startMonthTotal,
      endMonthTotal: endMonthTotal,
      loading: STATE.LOADED,
    })
  }

  handleDateChange(name) {
    return (event) => {
      let parts = event.target.value.split('-');
      let state = {};
      state[name] = new Date(parts[0], parseInt(parts[1], 10) - 1, 1, 0, 0, 0);
      this.setState(state);
    };
  }

  render() {
    let formatToMonth = (date) => date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    let CardBody = ({ children }) => <div className="card-body">{children}</div>

    let body = null;

    if (this.state.loading === STATE.LOADING) {
      body = <CardBody><Loading /></CardBody>;
    }

    if (this.state.loading === STATE.LOADED) {
      body = [
        <CardBody><Totals movements={this.state.movements} /></CardBody>,
        <CardBody><TotalsByCategory movements={this.state.movements} /></CardBody>,
      ];
    }

    return (
      <div className="card col-12">
        <div className="card-body">
          <form className="form-inline ">
            <div className="form-group">
              <label className="sr-only">Início</label>
              <input type="month" class="form-control" id="start"
                onInput={this.handleDateChange('startDate')} value={formatToMonth(this.state.startDate)} />
            </div>
            <div className="form-group mx-sm-3">
              <label className="sr-only">Final</label>
              <input type="month" class="form-control" id="end"
                onInput={this.handleDateChange('endDate')} value={formatToMonth(this.state.endDate)} />
            </div>
            <button className="btn btn-primary material-icons" onClick={this.loadData}>search</button>
          </form>
        </div>
        {body}
      </div>
    );
  }
}

export default MonthCompare;