import AbstractView from '../framework/view/abstract-view.js';

const getEventLength = (dateFrom, dateTo) => {
  const startDateTime = new Date(dateFrom);
  const endDateTime = new Date(dateTo);

  return endDateTime - startDateTime;
};

const getEventStartDate = (dateFrom) => new Date(dateFrom);
export const sortByPrice = (a, b) => b.base_price - a.base_price;
export const sortByDate = (a, b) => getEventStartDate(a.date_from) - getEventStartDate(b.date_from);
const sortByTime = (a, b) => getEventLength(b.date_from, b.date_to) - getEventLength(a.date_from, a.date_to);


export const sortArray = [
  {
    sortName: 'Day',
    isDisabled: false,
    isChecked: false,
    cb: sortByDate
  },
  {
    sortName: 'Event',
    isDisabled: true,
    isChecked: false,
  },
  {
    sortName: 'Time',
    isDisabled: false,
    isChecked: false,
    cb: sortByTime
  },
  {
    sortName: 'Price',
    isDisabled: false,
    isChecked: true,
    cb: sortByPrice
  },
  {
    sortName: 'Offers',
    isDisabled: true,
    isChecked: false
  },
];


function createSortItemTemplate({sortName, isDisabled, isChecked}) {
  return `
      <div class="trip-sort__item  trip-sort__item--${sortName.toLowerCase()}">
        <input id="sort-${sortName.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName.toLowerCase()}"
        ${isDisabled ? 'disabled' : ''}
        ${isChecked ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${sortName.toLowerCase()}">${sortName}</label>
      </div>
  `;
}


function createSortTemplate() {
  const siteSort = Array.from(sortArray, (item) => createSortItemTemplate(item)).join('');

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
