import Component from 'inferno-component';
import SheetAPIService from '../Google/SheetAPIService';
import Loading from '../Loading';
import Totals from './Totals';

class MonthCompare extends Component {
  constructor(props) {
    super(props)

    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);

    this.state = {
      sheetId: props.params.id,
      loading: true,
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
    this.setState({
      movements: await this.service.getMovements({
        start: this.state.startDate,
        end: this.state.endDate,
      }),
      loading: false,
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

    let body = <Loading />;
    if (this.state.loading === false) {
      body = (
        <Totals movements={this.state.movements} />
      );
    }

    return (
      <div className="card col-12">
        <div className="card-body">
          <form className="form-inline ">
            <div className="form-group">
              <label className="sr-only">Início</label>
              <input type="month" class="form-control" id="start"
                onInput={this.handleDateChange('startDate')}
                value={formatToMonth(this.state.startDate)} />
            </div>
            <div className="form-group mx-sm-3">
              <label className="sr-only">Final</label>
              <input type="month" class="form-control" id="end"
                onInput={this.handleDateChange('endDate')}
                value={formatToMonth(this.state.endDate)} />
            </div>
            <button className="btn btn-primary material-icons"
              onClick={this.loadData}>
              search
            </button>
          </form>
        </div>
        <div className="card-body">{body}</div>
      </div>
    );
  }
}

export default MonthCompare;