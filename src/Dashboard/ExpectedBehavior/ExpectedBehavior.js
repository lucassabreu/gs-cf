import React, { Component } from 'react';
import Loading from '../../Loading'
import Form from './Form';

const CardBody = ({ children }) => (
  <div className="card col col-xs-12">
    <div className="card-body">{children}</div>
  </div>
)

class ExpectedBehavior extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthsToUse: 6,
      loaded: false,
      movements: null
    };
    this.onMonthsChange = this.onMonthsChange.bind(this);
  }

  componentDidMount() {
    this.calculate(this.state.monthsToUse);
  }

  async calculate(monthsToUse) {
    this.setState({ loaded: false });

    let lastMonth = new Date();
    lastMonth.setDate(0);
    let cutMonth = new Date();
    cutMonth.setDate(0);
    cutMonth.setMonth(cutMonth.getMonth() - monthsToUse);

    this.setState({
      loaded: true,
      monthsToUse: monthsToUse,
      movements: await this.props.sheet.getMonths({
        start: cutMonth,
        end: lastMonth,
      }),
    });
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
      </React.Fragment>
    );
  }
}

export default ExpectedBehavior