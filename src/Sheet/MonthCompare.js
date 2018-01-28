import React, { Component } from 'react';
import Loading from '../Loading';
import Totals from './Totals';
import CategoryTotalsByMonth from './CategoryTotalsByMonth';
import MonthlyTable from './MonthlyTable';
import Compare from './Compare';
import MovementsTable from './MovementsTable';

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
      loading: STATE.NOT_LOADED,
      startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1, 0, 0, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0),
      movements: [],
      months: [],
      activeTab: "comparation",
    };

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

    let filter = {
      start: this.state.startDate,
      end: this.state.endDate,
    };

    this.setState({
      movements: await this.props.sheet.getMovements(filter),
      months: await this.props.sheet.getMonths(filter),
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

    let firstMonth = this.state.months.slice(0, 1).pop();

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
            <button className="btn btn-primary material-icons col col-sx-12" onClick={this.loadData}>search</button>
          </form>
        </div>
        {this.state.loading === STATE.LOADING ? <CardBody><Loading /></CardBody> : null}
        {this.state.loading === STATE.LOADED ?
          <CardBody>
            <Nav className="nav-fill nav-pills">
              <NavSimpleItem id="comparation" activeTab={this.state.activeTab} toogle={this.toogleTab}>Comparação</NavSimpleItem>
              <NavSimpleItem id="totals" activeTab={this.state.activeTab} toogle={this.toogleTab}>Totais</NavSimpleItem>
              <NavSimpleItem id="months" activeTab={this.state.activeTab} toogle={this.toogleTab}>Mês</NavSimpleItem>
              <NavSimpleItem id="movements" activeTab={this.state.activeTab} toogle={this.toogleTab}>Movimentos</NavSimpleItem>
            </Nav>
            <TabContent className="card-body" activeTab={this.state.activeTab}>
              <TabPane tabId="totals">
                <Totals movements={this.state.movements} />
                <CategoryTotalsByMonth movements={this.state.movements} />
              </TabPane>
              <TabPane tabId="months">
                <MonthlyTable months={this.state.months} sheetId={this.state.sheetId} />
              </TabPane>
              <TabPane tabId="comparation">
                <Compare movements={this.state.movements} months={this.state.months} />
              </TabPane>
              <TabPane tabId="movements">
                <MovementsTable firstMonth={firstMonth} movements={this.state.movements} />
              </TabPane>
            </TabContent>
          </CardBody> : null}
      </div>
    );
  }
}

export default MonthCompare;