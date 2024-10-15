import AbstractView from '../framework/view/abstract-view.js';
import { sortMap } from '../utils/common.js';


function createSortItemTemplate({sortName, isDisabled, isChecked}) {
  return `
      <div class="trip-sort__item  trip-sort__item--${sortName.toLowerCase()}">
        <input id="sort-${sortName.toLowerCase()}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${sortName.toLowerCase()}"
          ${isDisabled ? 'disabled' : ''}
          ${isChecked ? 'checked' : ''}
          data-sort-type="${sortName}">
        <label class="trip-sort__btn" for="sort-${sortName.toLowerCase()}">${sortName}</label>
      </div>
  `;
}


function createSortTemplate() {
  const siteSort = Array.from(sortMap.entries(), (item) => createSortItemTemplate(item[1])).join('');

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
