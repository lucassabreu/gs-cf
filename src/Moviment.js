class Moviment {
  date = null;
  category = null;
  description = null;
  value = null;
  origin = null;

  constructor(date, category, description, value, origin) {
    this.date = date;
    this.category = category;
    this.description = description;
    this.value = parseFloat(value.trim().split(' ').slice(-1)[0]);
    this.origin = origin;
  }
}

export default Moviment;