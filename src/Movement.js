class Movement {
  date = null;
  category = null;
  description = null;
  value = null;
  origin = null;

  constructor(date, category, description, value, origin) {
    if (!(date instanceof Date)) {
      throw new Error(date);
    }

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

  getValue() {
    if (
      this.category === 'Pagamento de cartão' ||
      this.category === 'Resgate' ||
      this.category === 'Aplicação'
    ) {
      return 0;
    }
    return this.value;
  }
}

export default Movement;