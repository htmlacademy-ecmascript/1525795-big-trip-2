import SortView from '../view/sort-view.js';
import { UpdateType } from '../utils/common.js';

import { render, replace, remove } from '../framework/render.js';


export default class SortPresenter {
  #sortComponent = null;
  #sortContainer = null;
  #sortModel = null;
  // #route = null;

  // constructor(route, sortContainer, sortModel) {
  constructor(sortContainer, sortModel) {
    // this.#route = route;
    this.#sortContainer = sortContainer;
    this.#sortModel = sortModel;
    // this.#sortComponent = new SortView(this.#route);
  }

  init () {
    const currentSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView(this.#sortModel.currentSortType, this.#changeSortHandler);

    if (currentSortComponent === null) {
      render(this.#sortComponent, this.#sortContainer, 'afterbegin');
      return;
    }

    replace(this.sortComponent, currentSortComponent);
    remove(currentSortComponent);
  }

  removeComponent = () => {
    remove(this.#sortComponent);
  };

  #changeSortHandler = (newSortType) => {
    if (this.#sortModel.currentSortType !== newSortType) {
      this.#sortModel.setSortType(UpdateType.ALL, newSortType);
    }
  };
}
