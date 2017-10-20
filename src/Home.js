import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GoogleAPIService from './Google/GoogleAPIService';
import Loading from './Loading';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      files: [],
    }
  }

  async loadNextPage(pageToken) {
    try {
      const { files, nextPageToken } = await GoogleAPIService.listFiles(pageToken);
      this.setState({
        loading: false,
        files: this.state.files.concat(files),
      });
      if (nextPageToken) {
        this.loadNextPage(nextPageToken)
      }
    } catch (e) {
      console.error(e);
      this.setState({
        loading: false,
        files: [],
      })
    }
  }

  componentWillMount() {
    if (this.state.loading === true) {
      this.loadNextPage();
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }
    return (
      <div className="card col-12">
        <ul className="list-group list-group-flush">
          {this.state.files.map((f) => (
            <li key={f.id} className="list-group-item">
              <Link to={'/sheet/' + f.id}>{f.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Home;
