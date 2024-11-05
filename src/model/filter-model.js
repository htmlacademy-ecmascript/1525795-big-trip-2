import Observable from '../framework/observable.js';
import { DEFAULT_FILTER_TYPE } from '../utils/common.js';


export default class FilterModel extends Observable {
  #currentFilter = DEFAULT_FILTER_TYPE;

  get currentFilter() {
    return this.#currentFilter;
  }

  setFilter(updateType, filter) {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  }
}
