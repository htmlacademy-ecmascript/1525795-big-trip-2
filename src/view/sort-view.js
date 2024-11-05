import AbstractView from '../framework/view/abstract-view.js';
import { SortTypes, SortMethods, capitalize } from '../utils/common.js';


function createSortItemTemplate(sortType, currentSortType) {
  return `
      <div class="trip-sort__item  trip-sort__item--${sortType}">
        <input id="sort-${sortType}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${sortType}"
          ${SortMethods[capitalize(sortType)] === undefined ? 'disabled' : ''}
          ${sortType === currentSortType ? 'checked' : ''}
          data-sort-type="${sortType}">
        <label class="trip-sort__btn" for="sort-${sortType}">${capitalize(sortType)}</label>
      </div>
  `;
}


function createSortTemplate(currentSortType) {
  const siteSort = Array.from(Object.values(SortTypes),
    (item) => createSortItemTemplate(item.toLowerCase(), currentSortType.toLowerCase())).join('');

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${siteSort}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #changeSortHandler = null;

  constructor(currentSortType, changeSortHandler) {
    super();
    this.#currentSortType = currentSortType;
    this.#changeSortHandler = changeSortHandler;

    this.element.addEventListener('change', this.#onChangeSortType);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #onChangeSortType = (evt) => this.#changeSortHandler(SortTypes[evt.target.dataset.sortType.toUpperCase()]);
}
