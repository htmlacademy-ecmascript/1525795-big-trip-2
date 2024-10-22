import AbstractView from '../framework/view/abstract-view.js';


function createHeaderTemplate(tripTitle, tripDates, tripCost) {
  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>

        <p class="trip-info__dates">${tripDates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
      </p>
    </section>
  `;
}

export default class HeaderView extends AbstractView {
  #tripTitle = '';
  #tripDates = '';
  #tripCost = '';

  constructor(tripTitle, tripDates, tripCost) {
    super();
    this.#tripTitle = tripTitle;
    this.#tripDates = tripDates;
    this.#tripCost = tripCost;
  }

  get template() {
    return createHeaderTemplate(this.#tripTitle, this.#tripDates, this.#tripCost);
  }
}
