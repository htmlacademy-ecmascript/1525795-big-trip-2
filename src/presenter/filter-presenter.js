import FilterView from '../view/filter-view.js';
import { UpdateType, DEFAULT_FILTER_TYPE } from '../utils/common.js';

import { render, replace, remove } from '../framework/render.js';


export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #filterModel = null;
  #sortPresenter = null;

  constructor(filterContainer, filterModel, sortPresenter) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#sortPresenter = sortPresenter;
  }

  init() {
    const currentFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(this.#filterModel.currentFilter, this.#changeFilterHandler);

    if (currentFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, 'afterbegin');
      return;
    }

    replace(this.#filterComponent, currentFilterComponent);
    remove(currentFilterComponent);
  }

  removeComponent = () => {
    remove(this.#filterComponent);
  };

  resetFilterType = () => {
    this.#changeFilterHandler(DEFAULT_FILTER_TYPE);
    // После сброса фильтра в default, нужно его перерисовать
    this.init();
  };

  #changeFilterHandler = (newFilter) => {
    // Здесь сброс сортировки в Day (в соответствии с ТЗ: при изменении фильтра сбрасывать сортировку в Day)
    this.#sortPresenter.resetSortType();
    this.#filterModel.setFilter(UpdateType.ALL, newFilter);
  };
}
