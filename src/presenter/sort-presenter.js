import Observable from '../framework/observable.js';
import SortView from '../view/sort-view.js';
import { DEFAULT_SORT_TYPE } from '../utils/common.js';

import { render, replace, remove } from '../framework/render.js';


export default class SortPresenter extends Observable {
  #routeModel = null;
  #sortComponent = null;
  #sortContainer = null;
  #currentSortType = DEFAULT_SORT_TYPE;

  constructor(routeModel, sortContainer) {
    super();
    this.#routeModel = routeModel;
    this.#sortContainer = sortContainer;
  }

  init = () => this.refreshSort();

  get currentSortType() {
    return this.#currentSortType;
  }

  setSortType(sortType) {
    this.#currentSortType = sortType;
    this._notify();
  }

  refreshSort = () => {
    const currentSortComponent = this.#sortComponent;

    if (this.#routeModel.getRouteLength()) {
      this.#sortComponent = new SortView(this.#currentSortType, this.#changeSortHandler);

      if (currentSortComponent === null) {
        render(this.#sortComponent, this.#sortContainer, 'afterbegin');
        return;
      }

      replace(this.#sortComponent, currentSortComponent);
      remove(currentSortComponent);
    } else {
      this.removeComponent();
    }
  };

  removeComponent = () => {
    remove(this.#sortComponent);
    this.#sortComponent = null;
  };

  resetSortType = () => this.#changeSortHandler(DEFAULT_SORT_TYPE);

  #changeSortHandler = (newSortType) => {
    this.setSortType(newSortType);
  };
}
