import React, { Component } from 'react'
import UserMenu from './UserMenu';
import SheetMenu from './SheetMenu';
import { Link } from 'react-router-dom'
import { Collapse, NavbarToggler, Navbar as BootstrapNavbar } from 'reactstrap'


class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = { collapsed: true };
    this.toogleNavbar = this.toogleNavbar.bind(this)
  }

  toogleNavbar() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const { user, isSignedIn } = this.props;
    return (
      <BootstrapNavbar fixed="top" expand="md" color="dark" dark>
        <Link to="/" className="navbar-brand">GS CF</Link>
        <NavbarToggler onClick={this.toogleNavbar} />
        <Collapse isOpen={!this.state.collapsed} navbar className="justify-content-between">
          <SheetMenu />
          {isSignedIn && <UserMenu user={user} />}
        </Collapse>
      </BootstrapNavbar >
    );
  }
}

export default Navbar