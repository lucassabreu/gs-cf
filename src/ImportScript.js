import React from 'react';
import { highlightAuto } from 'highlight.js'
import 'highlight.js/styles/agate.css';

const ImportScript = () => (
    <pre className="col-12">
        <code className="js hljs" style={{ padding: "1rem 2rem" }}
            dangerouslySetInnerHTML={{ __html: script.value }} />
    </pre>
)

const script = highlightAuto(`
var originList = [];
jQuery('a[data-type=card]:not(:first)').each((i, e) => {
    originList[e.attributes['data-id'].value] = 'Cartão de Crédito';
    if (originList[e.attributes['data-bank'].value] = 'nbnk') {
        originList[e.attributes['data-id'].value] = 'Nubank';
    }
});
jQuery('a[data-type=savings]:not(:first)').each((i, e) => {
    originList[e.attributes['data-id'].value] = 'Investimo'; 
});
jQuery('a[data-type=account]:not(:first)').each((i, e) => {
    originList[e.attributes['data-id'].value] = 'Corrente'; 
});

var transactions = [];
function convert_transactions () {
    var originTransactions = jQuery('.transaction')
        .filter((i, t) => !t.classList.contains('duplicated'))
        .map((i, t) => {
            var el = jQuery(t);
            var origin = parseInt(el.attr('data-sid'));
            var originName = originList[origin];
            var transaction = {
                originId: origin,
                origin: originName,
                month: el.parent().parent().find('.month').text().trim(),
                day: el.find('.date strong').text().trim(),
                name: el.find('.name span.edit').text().trim(),
                value: parseFloat(el.find('.value .manual input[name=value]').val()
                    .replace(/R\\$/, '').replace(/\\./gi, '').replace(/,/, '.').replace(/\\s/g, '')),
                category: el.find('.category').text().trim()
            };
            transaction.date = convertDate(transaction.day + ' de ' + transaction.month);
            return transaction;
        });
    transactions = transactions.concat(originTransactions.toArray());
}

var months = {
    'Janeiro': '01',
    'Fevereiro': '02',
    'Março': '03',
    'Abril': '04',
    'Maio': '05',
    'Junho': '06',
    'Julho': '07',
    'Agosto': '08',
    'Setembro': '09',
    'Outubro': '10',
    'Novembro': '11',
    'Dezembro': '12',
};

function convertDate(strDate) {
    var date = strDate.split(' de ');
    return date[2] + '-' + months[date[1]] + '-' + (date[0] < 10 ? '0' : '') + date[0]
}

convert_transactions ();
console.log('ended !');

var csvdata = transactions.sort((n, p) => new Date(n.date) - new Date(p.date)).reduce(
    (r, t) => r + [t.date, t.category, t.name, (t.value + '').replace(/\\./, ','), t.origin].join("\\t") + "\\n",
    ""
);
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
download('guiabolso.csv', csvdata);
`)

export default ImportScript

