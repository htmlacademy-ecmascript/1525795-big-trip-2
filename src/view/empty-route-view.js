import AbstractView from '../framework/view/abstract-view.js';


function createEmptyRouteTemplate(message) {
  return `
    <p class="trip-events__msg">${message}</p>
  `;
}


export default class EmptyRouteView extends AbstractView {
  #displayMessage = '';

  constructor(displayMessage = 'Click New Event to create your first point') {
    super();
    this.#displayMessage = displayMessage;
  }

  get template() {
    return createEmptyRouteTemplate(this.#displayMessage);
  }
}
