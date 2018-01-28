import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Sheet from '../Google/Sheet'
import { Col } from 'reactstrap';
import Movement from '../Model/Movement';
import BalanceCard from './BalanceCard';

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
    const balances = [
      {
        key: 'totals',
        title: 'Totals',
        dataKey: 'name',
        balances: this.state.totals
      },
      {
        key: 'origins',
        title: 'Balances By Origin',
        dataKey: 'origin',
        balances: this.state.originBalances
      },
      {
        key: 'categoriesIcomes',
        title: 'Balances By Incomes',
        dataKey: 'category',
        balances: this.state.greaterIncomeCategoriesBalance
      },
      {
        key: 'categoriesDebts',
        title: 'Balances By Debts',
        dataKey: 'category',
        balances: this.state.greaterDebtsCategoriesBalance
      },
    ]

    return balances.map((b) => (
      <Col xs={12} sm={6} key={b.key}>
        <BalanceCard
          style={{ marginBottom: '1rem' }}
          loaded={this.state.loaded}
          title={b.title}
          dataKey={b.dataKey}
          balances={b.balances}
        />
      </Col>
    ))
  }
}

DashboardByFilter.propTypes = {
  sheet: PropTypes.instanceOf(Sheet),
  filter: PropTypes.object,
}

export default DashboardByFilter