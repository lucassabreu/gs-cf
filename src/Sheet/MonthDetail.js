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
        movements: await this.service.getMovements({
          month: this.state.month
        }),
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

    let line = (movement) => {
      return (
        <tr key={movement.id}>
          <td>{formatDate(movement.date)}</td>
          <td>{movement.category}</td>
          <td>{movement.description}</td>
          <td className="text-right">{formatMoney(movement.value, 2, ',', '.')}</td>
          <td>{movement.origin}</td>
        </tr>
      );
    }

    return (
      <div className="card col-12">
        <Totals className="card-body" movements={this.state.movements.filter(m => m.getValue() !== 0)} />
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
                </tr>
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

export default MonthDetail;