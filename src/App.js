import './registerServiceWorker';
import './App.css';
import { IndexLink, Link } from 'inferno-router'
import Component from 'inferno-component';
import GoogleAPIService from './GoogleAPIService';

class App extends Component {
  state = {
    isSignedIn : false,
  };

  constructor (props) {
    super(props);
    this.oAuthCallback = this.oAuthCallback.bind(this);
  }

  componentWillMount() {
    GoogleAPIService.onLoadOAuth(this.oAuthCallback);
  }

  oAuthCallback (isSignedIn) {
    this.setState({
      isSignedIn: isSignedIn,
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <IndexLink className="navbar-brand">Home</IndexLink>
          <Link to="/login">Login</Link>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <main className="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
              <section class="row text-center placeholders">
                { this.state.isSignedIn }
                { this.state.isSignedIn ?
                  this.props.children : <h1>not signed in</h1> }
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
