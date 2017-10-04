import Component from 'inferno-component';
import GoogleAPIService from './GoogleAPIService';

class SheetHome extends Component {
  constructor(props, { router }) {
    super(props);

    this.state = {
      router: router,
      sheetId: props.params.id,
      error: null,
    };

    this.onGetSheetValues = this.onGetSheetValues.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(error) {
    this.setState({
      error: error,
    });
  }

  componentWillMount() {
    GoogleAPIService.getSheetData(this.state.sheetId)
      .then(this.onGetSheetValues)
      .catch(this.onError);
  }

  onGetSheetValues(data) {
    console.log(data)
  }

  render() {
    return <div>{this.state.sheetId}</div>
  }
}

export default SheetHome
