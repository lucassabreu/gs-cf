import Component from 'inferno-component';
import GoogleAPIService from './GoogleAPIService';
import MonthlyTable from './Sheet/MonthlyTable.js';
import './SheetHome.css'
import Nav from 'inferno-bootstrap/dist/Navigation/Nav';
import NavItem from 'inferno-bootstrap/dist/Navigation/NavItem';
import NavLink from 'inferno-bootstrap/dist/Navigation/NavLink';
import TabContent from 'inferno-bootstrap/dist/TabContent';
import TabPane from 'inferno-bootstrap/dist/TabPane';
import Loading from './Loading';
import classnames from 'classnames';

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
      activeTab: 'monthly-table',
    };

    this.onGetSheetValues = this.onGetSheetValues.bind(this);
    this.onError = this.onError.bind(this);
  }

  async componentWillMount() {
    try {
      this.onGetSheetValues(
        await GoogleAPIService.getSheetData(this.state.sheetId)
      )
    } catch (e) {
      this.onError(e)

    }
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

  reduceToMonth(movements) {
    const monthHash = movements.reduce(
      (r, c) => {
        var key = parseInt(c.getMonthString().replace(/-/, ''), 10);
        if (r[key] === undefined) {
          r[key] = {
            month: c.getMonth(),
            key: key,
            balance: 0,
            credit: 0,
            debit: 0,
            movements: [],
          }
        }

        r[key][c.value < 0 ? 'debit' : 'credit'] += c.value;
        r[key].balance += c.value;
        r[key].movements.push(c)

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

  toogleTab(tabId) {
    this.setState({
      activeTab: tabId,
    })
  }

  render() {
    return (
      <div className="card col-12">
        <Nav pills className="card-body">
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === 'monthly-table' })}
              onClick={() => this.toogleTab('monthly-table')}>
              Saldo Mensal
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === 'other' })}
              onClick={() => this.toogleTab('other')}>
              Other
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent className="card-body" fade activeTab={this.state.activeTab}>
          <TabPane tabId="monthly-table">
            <MonthlyTable loading={this.state.loading} months={this.state.months} />
          </TabPane>
          <TabPane tabId="other">
            <Loading loading />
          </TabPane>
        </TabContent>
      </div>
    )
  }
}

export default SheetHome
