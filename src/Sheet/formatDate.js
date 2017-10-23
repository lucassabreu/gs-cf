export default function formatDate(date) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  return fill(d) + '/' + fill(m) + '/' + date.getFullYear();
}

function fill(number) {
  return number < 10 ? '0' + number : number;
}