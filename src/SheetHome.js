import Component from 'inferno-component';
import SheetAPIService from './Google/SheetAPIService';
import Nav from 'inferno-bootstrap/dist/Navigation/Nav';
import NavItem from 'inferno-bootstrap/dist/Navigation/NavItem';
import NavLink from 'inferno-bootstrap/dist/Navigation/NavLink';
import TabContent from 'inferno-bootstrap/dist/TabContent';
import TabPane from 'inferno-bootstrap/dist/TabPane';
import classnames from 'classnames';

import './SheetHome.css'
import MonthlyTable from './Sheet/MonthlyTable.js';
import Totals from './Sheet/Totals.js';

class SheetHome extends Component {
  constructor(props, { router }) {
    super(props);

    this.state = {
      router: router,
      sheetId: props.params.id,
      error: null,
      loading: true,
      movements: [],
      months: [],
      activeTab: 'totals',
    };

    this.service = new SheetAPIService({
      sheetId: this.state.sheetId
    });

    this.toogleTab = this.toogleTab.bind(this);
  }

  toogleTab(tabId) {
    this.setState({
      activeTab: tabId,
    })
  }

  componentWillMount() {
    if (this.state.loading) {
      this.updateMovements();
    }
  }

  async updateMovements() {
    this.setState({
      movements: await this.service.getMovements({}),
      months: await this.service.getMonths(),
      loading: false,
    });
  }

  render() {
    return (
      <div className="card col-12">
        <Nav fill pills className="card-body">
          <NavSimpleItem id="totals" activeTab={this.state.activeTab} toogle={this.toogleTab}>
            Totais
          </NavSimpleItem>
          <NavSimpleItem id="monthly-table" activeTab={this.state.activeTab} toogle={this.toogleTab}>
            Saldos Mensais
          </NavSimpleItem>
        </Nav>
        <TabContent className="card-body" fade activeTab={this.state.activeTab}>
          <TabPane tabId="totals">
            <Totals loading={this.state.loading} movements={this.state.movements} />
          </TabPane>
          <TabPane tabId="monthly-table">
            <MonthlyTable loading={this.state.loading} months={this.state.months} sheetId={this.state.sheetId} />
          </TabPane>
        </TabContent>
      </div>
    )
  }
}

class NavSimpleItem extends Component {
  render() {
    return (
      <NavItem>
        <NavLink className={classnames({ active: this.props.activeTab === this.props.id })}
          onClick={() => this.props.toogle(this.props.id)}>
          {this.props.children}
        </NavLink>
      </NavItem>
    );
  }
}

export default SheetHome
