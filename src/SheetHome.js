import Component from 'inferno-component';
import GoogleAPIService from './GoogleAPIService';
// import MonthlyTable from './Sheet/MonthlyTable.js';
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
        var key = c.getMonthString();
        if (r[key] === undefined) {
          r[key] = {
            month: c.getMonth(),
            balance: 0,
          }
        }

        r[key].balance += c.value;

        return r
      },
      {}
    );

    var months = [];
    for (var key in monthHash) {
      var month = monthHash[key];
      months.push(month);
    }
    months = months.sort((p, n) => new Date(n.month) - new Date(p.month))
    window.m = months;
    return months;
  }

  render() {
    var months = this.state.months
    months = months.sort((p, n) => n.month.getTime() < p.month.getTime())
    console.log(months[0]);
    console.log(months[1]);
    console.log(months[2]);

    return (
      // {/* <div className="col-6">
      //   <MonthlyTable loading={this.state.loading} months={this.state.months} />
      // </div> */}
      <ul>
        {months.map(m => m.month).map(m => <li>{m.toDateString()}</li>)}
      </ul>
    )
  }
}

export default SheetHome
