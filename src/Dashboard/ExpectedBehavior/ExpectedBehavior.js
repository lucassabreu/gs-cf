import React, { Component } from 'react';
import Loading from '../../Loading'
import Form from './Form';
import Month from '../../Model/Month'
import Sheet from '../../Google/Sheet'
import PropTypes from 'prop-types'
import MeanWithMeanErrorChart from '../../Charts/MeanWithMeanErrorChart'

class ExpectedBehavior extends Component {
  static propTypes = {
    sheet: PropTypes.instanceOf(Sheet).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      monthsToUse: 6,
      loaded: false,
      movements: null,
      categoriesByMonth: [],
    };
    this.onMonthsChange = this.onMonthsChange.bind(this);
  }

  componentDidMount() {
    this.calculate(this.state.monthsToUse);
  }

  async calculate(monthsToUse) {
    this.setState({
      loaded: false,
      monthsToUse: monthsToUse,
    });

    let lastMonth = new Date();
    lastMonth.setDate(0);
    let cutMonth = new Date();
    cutMonth.setDate(0);
    cutMonth.setMonth(cutMonth.getMonth() - monthsToUse);

    const months = await this.props.sheet.getMonths({
      start: cutMonth,
      end: lastMonth,
    });

    let promices = [];

    promices.push(this.aggregateByCategory(months));

    promices.push()

    await Promise.all(promices);

    this.setState({ loaded: true });
  }

  /**
   * @param {Month[]} months
   */
  aggregateByCategory(months) {
    let categories = [];
    const categoriesByMonthMap = months
      .map((m) => ({
        month: m.month,
        categories: m.movements.reduce((c, mov) => {
          if (categories.indexOf(mov.category) < 0) {
            categories.push(mov.category);
          }
          c[mov.category] = (c[mov.category] || 0) + mov.getValue();
          return c;
        }, {})
      }))
      .map((m) => {
        for (let category of categories) {
          if (!m.categories[category]) {
            m.categories[category] = 0;
          }
        }
        return m;
      })
      .reduce((c, m) => {
        for (let key in m.categories) {
          if (c[key] === undefined) {
            c[key] = [];
          }
          c[key].push(m.categories[key])
        }
        return c;
      }, {});

    const categoriesByMonth = Object.keys(categoriesByMonthMap).map((key) => ({
      category: key,
      values: categoriesByMonthMap[key],
    }));

    this.setState({ categoriesByMonth: categoriesByMonth });
  }

  onMonthsChange({ months }) {
    this.calculate(months);
  }

  render() {
    return (
      <React.Fragment>
        <Form className="justify-content-around col-12" style={{ marginBottom: '1em' }}
          enabled={this.state.loaded} months={this.state.monthsToUse} onChange={this.onMonthsChange} />
        {!this.state.loaded && <Loading className="col-12" />}
        <MeanWithMeanErrorChart className="col-6" data={this.state.categoriesByMonth}
          dataKey="category" values="values" noBorders label="category" />
      </React.Fragment>
    );
  }
}

export default ExpectedBehavior