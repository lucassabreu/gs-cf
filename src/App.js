import './registerServiceWorker';
import './App.css';
import Component from 'inferno-component';

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <span>Home</span>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <main className="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
              <section class="row text-center placeholders">
                { this.props.children }
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
