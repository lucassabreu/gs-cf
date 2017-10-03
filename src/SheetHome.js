import Component from 'inferno-component';
import GoogleAPIService from './GoogleAPIService';

class SheetHome extends Component {
  constructor(props, { router }) {
    super(props);

    this.state = {
      router: router,
      sheetId: props.params.id,
    };

    this.onGetSheetValues = this.onGetSheetValues.bind(this);
  }

  componentWillMount() {
    GoogleAPIService.getSheetData(this.state.sheetId)
      .then(this.onGetSheetValues)
      .catch(console.error);
  }

  onGetSheetValues(data) {
    console.log(data)
  }

  render () {
    return <div>{this.state.sheetId}</div>
  }
}

export default SheetHome
