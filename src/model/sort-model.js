import Observable from '../framework/observable.js';
import { DEFAULT_SORT_TYPE } from '../utils/common.js';


export default class SortModel extends Observable {
  #currentSortType = DEFAULT_SORT_TYPE;

  get currentSortType() {
    return this.#currentSortType;
  }

  setSortType(updateType, sortType) {
    console.log('set sort type');
    this.#currentSortType = sortType;
    this._notify(updateType, sortType);
  }
}
