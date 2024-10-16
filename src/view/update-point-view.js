import AbstractView from '../framework/view/abstract-view.js';
import { pointTypes } from '../mock/point-type.js';
import { destinations, getDestinationById, getDestinationByName } from '../mock/destination.js';
import { offers } from '../mock/offer.js';
import { replace } from '../framework/render.js';


function getPointTypesList(defaultPointTypeName) {
  // Список видов точек маршрута
  let pointTypesList = '';
  for (let i = 0; i < pointTypes.length; i++) {
    const checked = pointTypes[i].name.toLowerCase() === defaultPointTypeName.toLowerCase() ? 'checked' : '';
    pointTypesList += `
      <div class="event__type-item">
        <input id="event-type-${pointTypes[i].name.toLowerCase()}-1" class="event__type-input  visually-hidden"
        type="radio" name="event-type" value="${pointTypes[i].name.toLowerCase()}" ${checked}>
        <label class="event__type-label  event__type-label--${pointTypes[i].name.toLowerCase()}"
        for="event-type-${pointTypes[i].name.toLowerCase()}-1">${pointTypes[i].name}</label>
      </div>`;
  }
  return pointTypesList;
}


function getDestinationsList() {
  // Список пунктов назначения для выпадающего списка в форме редактирования
  let destinationsList = '';
  for (let i = 0; i < destinations.length; i++) {
    destinationsList += `<option value="${destinations[i].name}"></option>`;
  }
  return destinationsList;
}


function getOffers(pointTypeName, pointOffers) {
  // Список дополнительных опций для вида точки маршрута
  let offersList = '';

  for (let i = 0; i < offers.length; i++) {
    if (offers[i].type.toLowerCase() === pointTypeName.toLowerCase()) {
      if (offers[i].offers.length > 0) {
        offersList += `
          <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
        `;

        for (let j = 0; j < offers[i].offers.length; j++) {
          offersList += `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offers[i].offers[j].id}"
              type="checkbox" name="event-offer-${offers[i].offers[j].id}" ${pointOffers.includes(offers[i].offers[j].id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offers[i].offers[j].id}">
                <span class="event__offer-title">${offers[i].offers[j].title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offers[i].offers[j].price}</span>
              </label>
            </div>
          `;
        }
        offersList += `
            </div>
          </section>
        `;
      }
    }
  }

  return offersList;
}


const getFormattedDate = (date) => {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(2, 4);

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};


function createUpdatePointTemplate(routePoint) {
  const pointTypeName = routePoint.type;
  const destinationName = getDestinationById(routePoint.destination).name;
  const dateFrom = getFormattedDate(new Date(routePoint.date_from));
  const dateTo = getFormattedDate(new Date(routePoint.date_to));

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${routePoint.id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointTypeName.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${routePoint.id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${getPointTypesList(pointTypeName)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${routePoint.id}">
              ${pointTypeName}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${routePoint.id}" type="text" name="event-destination"
            value="${destinationName}" list="destination-list-${routePoint.id}">
            <datalist id="destination-list-${routePoint.id}">
              ${getDestinationsList()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${routePoint.id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${routePoint.id}" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${routePoint.id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${routePoint.id}" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${routePoint.id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${routePoint.id}" type="text" name="event-price" value="${routePoint.base_price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${getOffers(pointTypeName, routePoint.offers)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${getDestinationByName(destinationName).description}</p>
          </section>
        </section>
      </form>
    </li>
  `;
}

export default class UpdatePointView extends AbstractView {
  #routePoint = null;

  constructor(routePoint) {
    super();
    this.#routePoint = routePoint;
  }

  get template() {
    return createUpdatePointTemplate(this.#routePoint);
  }

  replaceFormToRow(rowComponent, updateComponent) {
    replace(rowComponent, updateComponent);
  }
}
