import Component from 'inferno-component';

class LoadSheetForm extends Component {
  constructor(props, { router }) {
    super(props);
    this.state = {
      router: router,
      spreadsheetId: props.params.id || ""
    };

    this.openSheet = this.openSheet.bind(this);
    this.onSpreadsheetIdInput = this.onSpreadsheetIdInput.bind(this);
  }

  openSheet(event) {
    event.preventDefault();
    this.state.router.push(`/sheet/${this.state.spreadsheetId}`);
    return false;
  }

  onSpreadsheetIdInput(event) {
    this.setState({
      spreadsheetId: event.target.value,
    });
  }

  render() {
    return (
      <form class="form-inline" onSubmit={this.openSheet}>
        <input class="form-control mr-sm-2" type="text" placeholder="Spreadsheet ID"
          onInput={this.onSpreadsheetIdInput} value={this.state.spreadsheetId} />
        <button class="btn btn-outline-success" type="submit">Abrir</button>
      </form>
    );
  }
}

export default LoadSheetForm;