import AbstractView from '../framework/view/abstract-view.js';
import { filtersArray } from '../util.js';


function createFilterItemTemplate(filterName) {
  return `
      <div class="trip-filters__filter">
        <input id="filter-${filterName.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName.toLowerCase()}">
        <label class="trip-filters__filter-label" for="filter-${filterName.toLowerCase()}">${filterName}</label>
      </div>
  `;
}


function createFilterTemplate() {
  const siteFilters = Array.from(filtersArray, (item) => createFilterItemTemplate(item)).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${siteFilters}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}


export default class FilterView extends AbstractView {
  get template() {
    return createFilterTemplate();
  }
}
