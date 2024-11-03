import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/common.js';


function createFilterItemTemplate(filterName, currentFilter) {
  return `
      <div class="trip-filters__filter">
        <input id="filter-${filterName}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio" name="trip-filter"
          value="${filterName}"
          data-filter-type="${filterName}"
          ${filterName === currentFilter ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
      </div>
  `;
}


function createFilterTemplate(currentFilter) {
  const siteFilters = Array.from(Object.values(FilterType),
    (item) => createFilterItemTemplate(item.toLowerCase(), currentFilter.toLowerCase())).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${siteFilters}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}


export default class FilterView extends AbstractView {
  #currentFilter = null;
  #changeFilterHandler = null;

  constructor(currentFilter, changeFilterHandler) {
    super();
    this.#currentFilter = currentFilter;
    this.#changeFilterHandler = changeFilterHandler;

    this.element.addEventListener('change', this.#onChangeFilter);
  }

  get template() {
    return createFilterTemplate(this.#currentFilter);
  }

  #onChangeFilter = (evt) => this.#changeFilterHandler(FilterType[evt.target.dataset.filterType.toUpperCase()]);
}
