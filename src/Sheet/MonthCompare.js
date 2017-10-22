import React, { Component } from 'react';
import SheetAPIService from '../Google/SheetAPIService';
import Loading from '../Loading';
import Totals from './Totals';
import TotalsByCategory from './TotalsByCategory';
import MonthlyTable from './MonthlyTable';
import Compare from './Compare';

import NavSimpleItem from '../NavSimpleItem';
import { TabContent, TabPane, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import './MonthCompare.css';

const STATE = {
  NOT_LOADED: 0,
  LOADING: 1,
  LOADED: 2,
};

class MonthCompare extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired
  }

  constructor(props) {
    super(props)

    let today = new Date();

    this.state = {
      sheetId: props.match.params.id,
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
      this.setState({
        [name]: new Date(parts[0], parseInt(parts[1], 10) - 1, 1, 0, 0, 0),
      });
    };
  }

  render() {
    let formatToMonth = (date) => date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    let CardBody = ({ children }) => <div className="card-body">{children}</div>

    return (
      <div className="card col-12 MonthCompare">
        <div className="card-body">
          <form className="form-inline">
            <div className="form-group">
              <label className="sr-only">Início</label>
              <input type="month" className="form-control" id="start"
                onChange={this.handleDateChange('startDate')} value={formatToMonth(this.state.startDate)} />
            </div>
            <div className="form-group mx-sm-3">
              <label className="sr-only">Final</label>
              <input type="month" className="form-control" id="end"
                onChange={this.handleDateChange('endDate')} value={formatToMonth(this.state.endDate)} />
            </div>
            <button className="btn btn-primary material-icons" onClick={this.loadData}>search</button>
          </form>
        </div>
        {this.state.loading === STATE.LOADING ? <CardBody><Loading /></CardBody> : null}
        {this.state.loading === STATE.LOADED ?
          <CardBody>
            <Nav className="nav-fill nav-pills">
              <NavSimpleItem id="movements" activeTab={this.state.activeTab} toogle={this.toogleTab}>Totais</NavSimpleItem>
              <NavSimpleItem id="months" activeTab={this.state.activeTab} toogle={this.toogleTab}>Mês</NavSimpleItem>
              <NavSimpleItem id="comparation" activeTab={this.state.activeTab} toogle={this.toogleTab}>Comparação</NavSimpleItem>
            </Nav>
            <TabContent className="card-body" activeTab={this.state.activeTab}>
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
          </CardBody> : null}
      </div>
    );
  }
}

export default MonthCompare;