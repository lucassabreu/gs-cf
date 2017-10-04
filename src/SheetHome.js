import Component from 'inferno-component';
import GoogleAPIService from './GoogleAPIService';
import formatMoney from './formatMoney';
import './SheetHome.css'

class SheetHome extends Component {
  constructor(props, { router }) {
    super(props);

    this.state = {
      router: router,
      sheetId: props.params.id,
      error: null,
      data: [],
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
    this.setState({
      data: data,
    })
  }

  render() {
    const movimentToLine = (m) => {
      return <tr>
        <td>{m.date}</td>
        <td>{m.category}</td>
        <td>{m.description}</td>
        <td className="text-right">{formatMoney(m.value, 2, ',', '.')}</td>
        <td>{m.origin}</td>
      </tr>
    }

    return (
      <table class="table table-sm">
        <thead>
          <th>Data</th>
          <th>Categoria</th>
          <th>Descrição</th>
          <th className="text-right">Valor</th>
          <th>Origem</th>
        </thead>
        <tbody>
          {this.state.data.map(movimentToLine)}
        </tbody>
      </table>
    )
  }
}

export default SheetHome
