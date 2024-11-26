import AbstractView from '../framework/view/abstract-view.js';
import { StateTypeMessage } from '../utils/common.js';


function createEmptyRouteTemplate(message) {
  return `
    <p class="trip-events__msg">${message}</p>
  `;
}


export default class EmptyRouteView extends AbstractView {
  #displayMessage = '';

  constructor(displayMessage = StateTypeMessage.NO_DATA) {
    super();
    this.#displayMessage = displayMessage;
  }

  get template() {
    return createEmptyRouteTemplate(this.#displayMessage);
  }
}
