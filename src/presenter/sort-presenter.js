import SortView from '../view/sort-view.js';
import { UpdateType, DEFAULT_SORT_TYPE } from '../utils/common.js';

import { render, replace, remove } from '../framework/render.js';


export default class SortPresenter {
  #routeModel = null;
  #sortComponent = null;
  #sortContainer = null;
  #sortModel = null;

  constructor(routeModel, sortContainer, sortModel) {
    this.#routeModel = routeModel;
    this.#sortContainer = sortContainer;
    this.#sortModel = sortModel;
  }

  init = () => this.refreshSort();

  refreshSort = () => {
    const currentSortComponent = this.#sortComponent;

    if (this.#routeModel.getRouteLength()) {
      this.#sortComponent = new SortView(this.#sortModel.currentSortType, this.#changeSortHandler);

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
    if (this.#sortModel.currentSortType !== newSortType) {
      this.#sortModel.setSortType(UpdateType.ALL, newSortType);
    }
  };
}
