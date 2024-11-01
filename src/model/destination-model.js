import { destinations } from '../mock/destination.js';
import { getRandomArrayItem } from '../util.js';
// import { getRandomPoint } from '../mock/gen-point.js';
import Observable from '../framework/observable.js';
// import { getDestinationById } from '../mock/destination.js';
// import { sortByDate } from '../utils/common.js';
// import { getFormattedRangeDate } from '../util.js';
// import { getOfferById } from '../mock/offer.js';


export default class DestinationModel extends Observable {
  #destinations = destinations;

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations[this.#destinations.findIndex((item) => item.id === id)]
  }

  getDestinationByName(name) {
    return this.#destinations[this.#destinations.findIndex((item) => item.name.toLowerCase() === name.toLowerCase())];
  }

  getRandomDestination() {
    return getRandomArrayItem(this.#destinations).id;
  }

  addDestination(destination) {
    this.#destinations.push(destination);

    this._notify();
  }

  updateDestination(destination) {
    const idx = this.#destinations.findIndex((item) => item.id === destination.id);

    if (idx === -1) {
      // Nothing to update
      return false;
    }

    this.#destinations = [...this.#destinations.slice(0, idx), destination, ...this.#destinations.slice(idx + 1)];

    this._notify();
  }

  deleteDestination(destination) {
    const idx = this.#destinations.findIndex((item) => item.id === destination.id);

    if (idx === -1) {
      // Nothing to delete
      return false;
    }

    this.#destinations = [...this.#destinations.slice(0, idx), ...this.#destinations.slice(idx + 1)];

    this._notify();
  }
}
