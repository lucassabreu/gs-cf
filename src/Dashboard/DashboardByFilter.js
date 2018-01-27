import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Sheet from '../Google/Sheet'
import { Col } from 'reactstrap';
import Movement from '../Model/Movement';
import BalanceCard from './BalanceCard';
import StackGrid from 'react-stack-grid'
import sizeMe from 'react-sizeme';

class DashboardByFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      originBalances: [],
      greaterIncomeCategoriesBalance: [],
      greaterDebtsCategoriesBalance: [],
      totals: []
    }
  }

  async componentDidMount() {
    if (this.state.loaded === false) {
      const movements = await this.props.sheet.getMovements(this.props.filter);

      var promices = [];

      promices.push(this.calculateOriginBalances(movements));
      promices.push(this.calculateCategoryBalances(movements));
      promices.push(this.calculateIncomeVsDebt(movements));

      await Promise.all(promices);
      this.setState({ loaded: true })
    }
  }

  calculateIncomeVsDebt(movements) {
    const totals = movements.reduce((c, m) => {
      const key = m.value > 0 ? 'Credits' : 'Debts';
      c[key] = (c[key] || 0) + m.getValue();
      return c
    }, {});

    this.setState({
      totals: Object.keys(totals).map((key) => ({
        name: key,
        balance: totals[key]
      })).sort((a, b) => Math.abs(a.balance) > Math.abs(b.balance) ? -1 : 1)
    })
  }

  mapByKey(movements, key) {
    const list = movements.reduce(
      (c, m) => {
        c[m[key]] = (c[m[key]] || 0) + m.getValue();
        return c
      },
      {}
    );

    return Object.keys(list).map((listKey) => ({
      [key]: listKey,
      balance: list[listKey]
    }));
  }

  /**
   * @param {Movement[]} movements 
   */
  async calculateOriginBalances(movements) {
    const origins = this.mapByKey(movements, "origin");
    this.setState({
      originBalances: origins.sort(
        (a, b) => a.balance < b.balance ? 1 : -1
      )
    });
  }

  /**
   * @param {Movement[]} movements 
   */
  async calculateCategoryBalances(movements) {
    const categories = this.mapByKey(movements, "category");
    const incomes = categories.filter(c => c.balance > 0)
      .sort((a, b) => a.balance < b.balance ? 1 : -1);
    const debts = categories.filter(c => c.balance < 0)
      .sort((a, b) => a.balance > b.balance ? 1 : -1);
    this.setState({
      greaterIncomeCategoriesBalance: incomes.slice(0, 5),
      greaterDebtsCategoriesBalance: debts.slice(0, 5),
    });
  }

  render() {
    const { size: { width } } = this.props;
    return (
      <Col xs={12} >
        <StackGrid columnWidth={width <= 500 ? '100%' : '50%'}>
          <BalanceCard
            key="totals"
            loaded={this.state.loaded}
            title="Totals"
            dataKey="name"
            balances={this.state.totals}
          />
          <BalanceCard
            key="origins"
            loaded={this.state.loaded}
            title="Balances By Origin"
            dataKey="origin"
            balances={this.state.originBalances}
          />
          <BalanceCard
            key="categoriesDebts"
            loaded={this.state.loaded}
            title="Balances By Debts"
            dataKey="category"
            balances={this.state.greaterDebtsCategoriesBalance}
          />
          <BalanceCard
            key="categoriesIcomes"
            loaded={this.state.loaded}
            title="Balances By Incomes"
            dataKey="category"
            balances={this.state.greaterIncomeCategoriesBalance}
          />
        </StackGrid>
      </Col>
    );
  }
}

DashboardByFilter.propTypes = {
  sheet: PropTypes.instanceOf(Sheet),
  filter: PropTypes.object,
}

export default sizeMe()(DashboardByFilter)