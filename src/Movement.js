class Movement {
  date = null;
  category = null;
  description = null;
  value = null;
  origin = null;

  constructor(date, category, description, value, origin) {
    this.date = date;
    this.category = category;
    this.description = description;
    this.value = value;
    this.origin = origin;
  }

  getMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  }

  getMonthString() {
    const m = this.date.getMonth();
    return this.date.getFullYear() + '-' + (m > 9 ? m : '0' + m);
  }
}

export default Movement;