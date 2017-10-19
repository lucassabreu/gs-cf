import Component from 'inferno-component';
import SheetAPIService from '../Google/SheetAPIService';
import Loading from '../Loading';
import Totals from './Totals';
import TotalsByCategory from './TotalsByCategory';
import MonthlyTable from './MonthlyTable';
import Compare from './Compare';

import Nav from 'inferno-bootstrap/dist/Navigation/Nav';
import NavSimpleItem from '../NavSimpleItem';
import TabContent from 'inferno-bootstrap/dist/TabContent';
import TabPane from 'inferno-bootstrap/dist/TabPane';

const STATE = {
  NOT_LOADED: 0,
  LOADING: 1,
  LOADED: 2,
};

class MonthCompare extends Component {
  constructor(props) {
    super(props)

    let today = new Date();

    this.state = {
      sheetId: props.params.id,
      loading: STATE.NOT_LOADED,
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0),
      movements: [],
      activeTab: "movements",
    };

    this.service = new SheetAPIService({
      sheetId: this.state.sheetId,
    });

    this.loadData = this.loadData.bind(this);
    this.toogleTab = this.toogleTab.bind(this);
  }

  toogleTab(activeTab) {
    this.setState({
      activeTab: activeTab,
    });
  }

  componentWillMount() {
    if (this.state.loading === STATE.NOT_LOADED) {
      this.loadData();
    }
  }

  async loadData(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ loading: STATE.LOADING });

    let months = (await this.service.getMonthTotals(this.state.startDate, this.state.endDate))
      .sort((n, p) => p.month.getTime() - n.month.getTime());

    let endMonthTotal = months.pop();
    let startMonthTotal = months.pop();

    if (startMonthTotal === undefined) {
      startMonthTotal = endMonthTotal;
    }

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
      body = [];
      body.push(
        <CardBody>
          <Nav fill pills>
            <NavSimpleItem id="movements" activeTab={this.state.activeTab} toogle={this.toogleTab}>Totais</NavSimpleItem>
            <NavSimpleItem id="months" activeTab={this.state.activeTab} toogle={this.toogleTab}>Mês</NavSimpleItem>
            <NavSimpleItem id="comparation" activeTab={this.state.activeTab} toogle={this.toogleTab}>Comparação</NavSimpleItem>
          </Nav>
        </CardBody>
      );
      body.push(
        <TabContent className="card-body" fade activeTab={this.state.activeTab}>
          <TabPane tabId="movements">
            <Totals movements={this.state.movements} />
            <TotalsByCategory movements={this.state.movements} />
          </TabPane>
          <TabPane tabId="months">
            <MonthlyTable months={[this.state.startMonthTotal, this.state.endMonthTotal]} sheetId={this.state.sheetId} />
          </TabPane>
          <TabPane tabId="comparation">
            <Compare movements={this.state.movements} startMonth={this.state.startMonthTotal} endMonth={this.state.endMonthTotal} />
          </TabPane>
        </TabContent>
      );
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