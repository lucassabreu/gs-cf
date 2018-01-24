import React, { Component } from 'react';

import Sheet from './Google/Sheet';
import './SheetHome.css'
import MonthlyTable from './Sheet/MonthlyTable.js';
import Totals from './Sheet/Totals.js';
import Loading from './Loading';
import PropTypes from 'prop-types';

class SheetHome extends Component {
  static propTypes = {
    sheet: PropTypes.instanceOf(Sheet).isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      loading: true,
      movements: [],
      months: [],
      activeTab: 'totals',
    };

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
      movements: await this.props.sheet.getMovements({}),
      months: await this.props.sheet.getMonths({}),
      loading: false,
    });
  }

  render() {
    let CardBody = ({ children }) => (
      <div className="card-body">{children}</div>
    );

    if (this.state.loading) {
      return <div className="card col-12"><CardBody><Loading /></CardBody></div>
    }

    return (
      <div className="card col-12">
        <CardBody>
          <Totals loading={this.state.loading} movements={this.state.movements} />
          <MonthlyTable loading={this.state.loading} months={this.state.months} sheetId={this.sheet.getId()} />
        </CardBody>
      </div>
    )
  }
}

export default SheetHome
