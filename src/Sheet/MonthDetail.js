import React, { Component } from 'react';
import Loading from '../Loading';
import Totals from './Totals';
import TotalsByCategory from './TotalsByCategory';
import MovementsTable from './MovementsTable';

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
      monthDate: new Date(params.year, params.month, 0),
      loading: true,
      month: null,
      activeTab: "movements",
    };

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
        month: (await this.props.sheet.getMonths({ month: this.state.monthDate })).pop(),
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

    let { movements } = this.state.month;
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
            <MovementsTable firstMonth={this.state.month} movements={this.state.month.movements || []} />
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