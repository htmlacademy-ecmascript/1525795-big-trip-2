import AbstractView from '../framework/view/abstract-view.js';
import { sortTypes, DEFAULT_SORT_TYPE, sortMethods, capitalize } from '../utils/common.js';


function createSortItemTemplate(sortName) {
  return `
      <div class="trip-sort__item  trip-sort__item--${sortName}">
        <input id="sort-${sortName}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${sortName}"
          ${sortName in sortMethods ? '' : 'disabled'}
          ${sortName === DEFAULT_SORT_TYPE ? 'checked' : ''}
          data-sort-type="${sortName}">
        <label class="trip-sort__btn" for="sort-${sortName.toLowerCase()}">${capitalize(sortName)}</label>
      </div>
  `;
}


function createSortTemplate() {
  const siteSort = Array.from(sortTypes, (item) => createSortItemTemplate(item)).join('');

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${siteSort}
    </form>
  `;
}

export default class SortView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createSortTemplate();
  }
}
