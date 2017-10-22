import React, { Component } from 'react'
import { matchPath } from 'react-router'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

class Menu extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    signOut: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { sheetId: props.match.params.id };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /** @param {Event} event */
  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push(`/sheet/${this.state.sheetId}`);
    return false;
  }

  /** @param {Event} event */
  handleChange(event) {
    this.setState({ sheetId: event.target.value })
  }

  componentWillReceiveProps(newProps) {
    let { location } = (newProps || this.props);
    let match = matchPath(location.pathname, '/sheet/:id');
    this.setState({ sheetId: match.params.id });
  }

  render() {
    return (
      <div className="collapse navbar-collapse" id="navbars">
        <ul className="navbar-nav mr-auto">
          {this.state.sheetId === undefined ? null :
            <li className="nav-item">
              <Link className="btn nav-link" to={`/sheet/${this.state.sheetId}/compare`}>Compare</Link>
            </li>
          }
          <li className="nav-item">
            <span className="btn nav-link" onClick={this.props.signOut}>Logout</span>
          </li>
        </ul>
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <input className="form-control mr-sm-2" type="text" placeholder="Spreadsheet ID"
            onChange={this.handleChange} value={this.state.sheetId} />
          <button className="btn btn-outline-success" type="submit">Abrir</button>
        </form>
      </div>
    )
  }
}

export default withRouter(Menu);