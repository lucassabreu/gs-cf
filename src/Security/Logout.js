import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Logout extends Component {
  static propTypes = {
    signOut: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      loggedOut: false
    }
  }

  async componentDidMount() {
    await this.props.signOut();
    this.setState({ loggedOut: true })
  }

  render() {
    if (this.state.loggedOut) {
      return <Redirect to='/login' />
    }
    return <h1>Logging out...</h1>
  }
}
