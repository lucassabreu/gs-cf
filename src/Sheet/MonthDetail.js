import Component from 'inferno-component';
import SheetAPIService from '../Google/SheetAPIService';
import Loading from '../Loading';
import Totals from './Totals';
import TotalsByCategory from './TotalsByCategory';
import formatDate from './formatDate';
import formatMoney from './formatMoney';

import classnames from 'classnames';
import Nav from 'inferno-bootstrap/dist/Navigation/Nav';
import NavItem from 'inferno-bootstrap/dist/Navigation/NavItem';
import NavLink from 'inferno-bootstrap/dist/Navigation/NavLink';
import TabContent from 'inferno-bootstrap/dist/TabContent';
import TabPane from 'inferno-bootstrap/dist/TabPane';

class MonthDetail extends Component {
  constructor(props, { router }) {
    super(props)
    let { params } = props;


    this.state = {
      sheetId: params.id,
      month: new Date(params.year, params.month - 1),
      loading: true,
      movements: [],
      activeTab: "movements",
    };

    this.service = new SheetAPIService({
      sheetId: this.state.sheetId,
    });

    this.toogleTab = this.toogleTab.bind(this);
  }

  toogleTab(tabId) {
    this.setState({
      activeTab: tabId,
    })
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
      <div className="card col-12">
        <Nav fill pills className="card-body">
          <NavSimpleItem id="movements" activeTab={this.state.activeTab} toogle={this.toogleTab}>
            Totais
          </NavSimpleItem>
          <NavSimpleItem id="categories" activeTab={this.state.activeTab} toogle={this.toogleTab}>
            Categorias
          </NavSimpleItem>
        </Nav>
        <TabContent className="card-body" fade activeTab={this.state.activeTab}>
          <TabPane tabId="movements">
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
          </TabPane>
          <TabPane tabId="categories">
            <TotalsByCategory movements={this.state.movements} />
          </TabPane>
        </TabContent>
      </div>
    );
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

export default MonthDetail;