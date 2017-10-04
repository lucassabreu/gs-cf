export default function formatMoney(n, c, d, t) {
  c = Math.abs(c)
  c = isNaN(c) ? 2 : c;

  d = d === undefined ? "." : d;
  t = t === undefined ? "," : t;
  var s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c), 10)),
    j = i.length;

  j = j > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};