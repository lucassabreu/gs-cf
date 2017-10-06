import Component from 'inferno-component';
import { Link } from 'inferno-router';
import GoogleAPIService from './GoogleAPIService';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      files: [],
    }
  }

  loadNextPage(nextPageToken) {
    GoogleAPIService.listFiles(nextPageToken)
      .then(({ files, nextPageToken }) => {
        this.setState({
          loading: false,
          files: this.state.files.concat(files),
        });
        if (nextPageToken) {
          this.loadNextPage(nextPageToken)
        }
      })
      .catch((e) => {
        console.error(e);
        this.setState({
          loading: false,
          files: [],
        })
      });
  }

  componentWillMount() {
    if (this.state.loading === true) {
      this.loadNextPage();
    }
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="card col-12">
        <ul className="list-group list-group-flush">
          {this.state.files.map((f) => {
            return <li class="list-group-item"><Link to={'/sheet/' + f.id}>{f.name}</Link></li>
          })}
        </ul>
      </div>
    );
  }
}

export default Home;
