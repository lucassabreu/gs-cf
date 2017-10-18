import Component from 'inferno-component';
import { IndexLink, Link } from 'inferno-router';
import GoogleAPIService from './Google/GoogleAPIService';
import LoadSheetForm from './LoadSheetForm';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  constructor(props, { router }) {
    super(props);
    this.state = {
      router: router,
    };
  }

  signOut() {
    GoogleAPIService.signOut();
  }

  render() {
    var menu = null;
    if (this.state.router.url !== "/login") {
      let links = [];
      if (this.props.params.id) {
        links.push(
          <li className="nav-item">
            <Link className="btn nav-link" to={`/sheet/${this.props.params.id}/compare`}>
              Compare
            </Link>
          </li>
        );
      }

      menu = (
        <div className="collapse navbar-collapse" id="navbars">
          <ul className="navbar-nav mr-auto">
            {links}
            <li className="nav-item">
              <span className="btn nav-link" onClick={this.signOut}>Logout</span>
            </li>
          </ul>
          <LoadSheetForm params={this.props.params} router={this.state.router} />
        </div>
      );
    }

    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <IndexLink className="navbar-brand">GS CF</IndexLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbars"
            aria-controls="navbars" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {menu}
        </nav>

        <div className="container-fluid">
          <div className="row justify-content-center">
            <main className="col-10 pt-3" role="main">
              <section className="row">
                {this.props.children}
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;