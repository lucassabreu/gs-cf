import React, { Component } from 'react'
import PropTypes from 'prop-types'
import getCount from '../../counter'

class Form extends Component {
  static propTypes = {
    months: PropTypes.number.isRequired,
    enabled: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    enabled: true,
    className: "",
    style: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      counter: getCount(),
      months: this.props.months
    }
    this.nofifyChange = this.nofifyChange.bind(this);
    this.registerChange = this.registerChange.bind(this);
  }

  componentWillReceiveProps({ months }) {
    this.setState({ months: months })
  }

  registerChange(event) {
    this.setState({ months: parseInt(event.target.value, 10) })
  }

  nofifyChange(event) {
    if (this.props.onChange) {
      this.props.onChange({ months: this.state.months });
    }
    event.preventDefault();
  }

  render() {
    return (
      <form className={`form-inline ${this.props.className}`} style={this.props.style} onSubmit={this.nofifyChange}>
        <div className="form-group mb-2 ">
          <label className="mb-2 col-form-label" htmlFor={`months_${this.state.counter}`}>Months to Use:</label>
        </div>
        <div className="form-group mb-2 mx-sm-3">
          <input value={this.state.months} onChange={this.registerChange} id={`months_${this.state.counter}`} disabled={!this.props.enabled}
            type="number" className="form-control form-control-sm" placeholder="Enter number of months" />
        </div>
        <button disabled={!this.props.enabled} type="submit" className="btn btn-primary mb-2">Calculate</button>
      </form>
    );
  }
}

export default Form;