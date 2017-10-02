import Component from 'inferno-component';
import { IndexLink, Link } from 'inferno-router';
import './App.css';
import GoogleAPIService from './GoogleAPIService';

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
      menu = (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/other/thing" className="nav-link" href="#">Other (thing)</Link>
          </li>
          <li className="nav-item">
            <Link to="/other/time" className="nav-link" href="#">Other (time)</Link>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={this.signOut}>Sign out</span>
          </li>
        </ul>
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

          <div className="collapse navbar-collapse" id="navbars">{menu}</div>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <main className="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
              <section className="row text-center placeholders">
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