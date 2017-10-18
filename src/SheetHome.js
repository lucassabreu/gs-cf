import Component from 'inferno-component';
import SheetAPIService from './Google/SheetAPIService';

import './SheetHome.css'
import MonthlyTable from './Sheet/MonthlyTable.js';
import Totals from './Sheet/Totals.js';
import Loading from './Loading';

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
    let CardBody = ({ children }) => (
      <div className="card-body">{children}</div>
    );

    let body = <CardBody><Loading /></CardBody>
    if (this.state.loading === false) {
      body = [
        <CardBody><Totals loading={this.state.loading} movements={this.state.movements} /></CardBody>,
        <CardBody><MonthlyTable loading={this.state.loading} months={this.state.months} sheetId={this.state.sheetId} /></CardBody>
      ]
    }

    return (
      <div className="card col-12">{body}</div>
    )
  }
}

export default SheetHome
