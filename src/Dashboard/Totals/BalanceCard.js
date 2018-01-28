import React from 'react'
import { ListGroupItemText, Card, CardHeader, CardBody } from 'reactstrap';
import Loading from '../../Loading'
import HorizontalBarChart from '../../Charts/HorizontalBarChart';

const BalanceCard = ({ style, title, balances, loaded, dataKey }) => (
  <Card style={style}>
    <CardHeader>{title}</CardHeader>
    {!loaded ? <CardBody><Loading /></CardBody> :
      <HorizontalBarChart noBorders dataKey={dataKey} value="balance"
        data={balances}
        label={(v) => <ListGroupItemText className="small" style={{ float: 'left' }} children={v[dataKey]} />}
        valueLabel={(v) => (
          <ListGroupItemText className="small" style={{ textAlign: 'right' }}
            children={`R$ ${v.balance.toLocaleString(undefined, 2)}`} />
        )}
      />}
  </Card>
)

export default BalanceCard;