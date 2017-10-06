import Component from 'inferno-component';
import GoogleAPIService from './GoogleAPIService';
import MonthlyTable from './Sheet/MonthlyTable.js';
import './SheetHome.css'

class SheetHome extends Component {
  constructor(props, { router }) {
    super(props);

    this.state = {
      router: router,
      sheetId: props.params.id,
      error: null,
      loading: true,
      data: [],
      months: [],
    };

    this.onGetSheetValues = this.onGetSheetValues.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentWillMount() {
    GoogleAPIService.getSheetData(this.state.sheetId)
      .then(this.onGetSheetValues)
      .catch(this.onError);
  }

  onError(error) {
    this.setState({ error: error });
  }

  onGetSheetValues(data) {
    this.setState({
      loading: false,
      data: data,
      months: this.reduceToMonth(data)
    })
  }

  reduceToMonth(moviments) {
    const monthHash = moviments.reduce(
      (r, c) => {
        var key = parseInt(c.getMonthString().replace(/-/, ''), 10);
        if (r[key] === undefined) {
          r[key] = {
            month: c.getMonth(),
            key: key,
            balance: 0,
            credit: 0,
            debit: 0,
            moviments: [],
          }
        }

        r[key][c.value < 0 ? 'debit' : 'credit'] += c.value;
        r[key].balance += c.value;
        r[key].moviments.push(c)

        return r
      },
      {}
    );

    var months = [];
    for (var key in monthHash) {
      months.push(monthHash[key]);
    }

    months = months.sort((n, p) => n.key - p.key)

    for (key in months) {
      var m = months[key];
      var prev = months[key - 1];
      m.prev = prev;
      m.initial = prev ? prev.final : 0;
      m.final = m.initial + m.balance;
    }

    return months
  }

  render() {
    return (
      <div className="card col-12">
        <ul class="nav nav-pills card-body" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="monthly-table-tab" data-toggle="tab" href="#monthly-table" role="tab"
              aria-controls="monthly-table" aria-expanded="true">
              Saldo Mensal
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="other-tab" data-toggle="tab" href="#other" role="tab" aria-controls="other">
              Other
              </a>
          </li>
        </ul>
          <div className="card-body tab-content">
            <div class="tab-pane fade show active" id="monthly-table" role="tabpanel" aria-labelledby="monthly-table-tab">
              <MonthlyTable loading={this.state.loading} months={this.state.months} />
            </div>
            <div class="tab-pane fade show active" id="other" role="tabpanel" aria-labelledby="other-tab">
              others
          </div>
        </div>
      </div>
    )
  }
}

export default SheetHome
