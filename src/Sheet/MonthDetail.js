import React, { Component } from 'react';
import SheetAPIService from '../Google/SheetAPIService';
import Loading from '../Loading';
import Totals from './Totals';
import TotalsByCategory from './TotalsByCategory';
import formatDate from './formatDate';
import formatMoney from './formatMoney';

import NavSimpleItem from '../NavSimpleItem';
import { TabContent, TabPane, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import './MonthDetail.css';

class MonthDetail extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.any,
    }).isRequired
  }

  constructor(props) {
    super(props)
    let { params } = props.match;

    this.state = {
      sheetId: params.id,
      monthDate: new Date(params.year, params.month, 0),
      loading: true,
      month: null,
      activeTab: "movements",
    };

    this.service = new SheetAPIService({
      sheetId: this.state.sheetId,
    });

    this.toogleTab = this.toogleTab.bind(this);
  }

  toogleTab(tabId) {
    if (this.state.activeTab !== tabId) {
      this.setState({
        activeTab: tabId,
      })
    }
  }

  async componentWillMount() {
    if (this.state.loading) {
      this.setState({
        loading: false,
        month: (await this.service.getMonths({ month: this.state.monthDate })).pop(),
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <div className="card col-12">
        <div className="card-body">
          <Loading />
        </div>
      </div>;
    }

    let { initial, movements } = this.state.month;

    let runSum = initial;
    let dailyRunSum = 0;
    let lastDate = null;
    let dayCount = 0;
    let line = (movement) => {
      if (lastDate === null || lastDate.getTime() !== movement.date.getTime()) {
        dayCount++;
        lastDate = movement.date;
        dailyRunSum = 0;
      }

      runSum += movement.value;
      dailyRunSum += movement.value;
      return (
        <tr key={movement.id} className={dayCount % 2 ? 'even' : 'odd'}>
          <td>{formatDate(movement.date)}</td>
          <td>{movement.category}</td>
          <td>{movement.description}</td>
          <td className="text-right">{formatMoney(movement.value, 2, ',', '.')}</td>
          <td>{movement.origin}</td>
          <td className="text-right">{formatMoney(dailyRunSum, 2, ',', '.')}</td>
          <td className="text-right">{formatMoney(runSum, 2, ',', '.')}</td>
        </tr>
      );
    }

    return (
      <div className="card col-12 MonthDetail">
        <Totals className="card-body" movements={movements.filter(m => m.getValue() !== 0)} />
        <Nav className="card-body nav-pills nav-fill">
          <NavSimpleItem id="movements" activeTab={this.state.activeTab} toogle={this.toogleTab}>
            Totais
          </NavSimpleItem>
          <NavSimpleItem id="categories" activeTab={this.state.activeTab} toogle={this.toogleTab}>
            Categorias
          </NavSimpleItem>
        </Nav>
        <TabContent className="card-body" activeTab={this.state.activeTab}>
          <TabPane tabId="movements">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th className="text-right">Valor</th>
                  <th>Origem</th>
                  <th colSpan="2" className="text-right">Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {movements.map(line)}
              </tbody>
            </table>
          </TabPane>
          <TabPane tabId="categories">
            <TotalsByCategory movements={movements} />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default MonthDetail;