import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class LoadSheetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spreadsheetId: props.match.params.id,
    };

    this.openSheet = this.openSheet.bind(this);
    this.onSpreadsheetIdInput = this.onSpreadsheetIdInput.bind(this);
  }

  openSheet(event) {
    event.preventDefault();
    let { match, location } = this.props;
    location.push(`/sheet/${match.params.id}`);
    return false;
  }

  onSpreadsheetIdInput(event) {
    this.setState({
      spreadsheetId: event.target.value,
    });
  }

  render() {
    return (
      <form className="form-inline" onSubmit={this.openSheet}>
        <input className="form-control mr-sm-2" type="text" placeholder="Spreadsheet ID"
          onInput={this.onSpreadsheetIdInput} value={this.state.spreadsheetId} />
        <button className="btn btn-outline-success" type="submit">Abrir</button>
      </form>
    );
  }
}

export default withRouter(LoadSheetForm);