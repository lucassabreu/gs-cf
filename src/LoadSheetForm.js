import Component from 'inferno-component';

class LoadSheetForm extends Component {
  render() {
    return (
      <form class="form-inline">
        <input class="form-control mr-sm-2" type="text" placeholder="Spreadsheet ID" aria-label="Spreadsheet ID" />
        <button class="btn btn-outline-success" type="submit">Abrir</button>
      </form>
    );
  }
}

export default LoadSheetForm;