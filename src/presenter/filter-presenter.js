import FilterView from '../view/filter-view.js';
import { UpdateType } from '../utils/common.js';

import { render, replace, remove } from '../framework/render.js';


export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #filterModel = null;

  constructor(filterContainer, filterModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
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

  #changeFilterHandler = (newFilter) => {
    if (this.#filterModel.currentFilter !== newFilter) {
      // Здесь добавить сброс сортировки в Day (в соответствии с ТЗ: при изменении фильтра сбрасывать сортировку в Day)
      this.#filterModel.setFilter(UpdateType.ALL, newFilter);
    }
  };
}
