import Component from 'inferno-component';
import SheetAPIService from './Google/SheetAPIService';
import MovementService from './Model/MovementService';
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
  }

  toogleTab(tabId) {
    this.setState({
      activeTab: tabId,
    })
  }

  async componentWillMount() {
    if (!this.state.sheetService || this.state.sheetId !== this.state.sheetService.getSheetId()) {
      this.setState({
        service : new MovementService(new SheetAPIService(this.state.sheetId)),
      });
    }
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
            <MonthlyTable loading={this.state.loading} service={this.state.service} />
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
