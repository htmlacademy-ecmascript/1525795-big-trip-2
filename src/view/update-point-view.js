import AbstractView from '../framework/view/abstract-view.js';
import { pointTypes } from '../mock/point-type.js';
import { destinations, getDestinationByName } from '../mock/destination.js';
import { offers } from '../mock/offer.js';


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


function getAvailableOffers(pointTypeName) {
  // Список дополнительных опций для вида точки маршрута
  let offersList = '';

  for (let i = 0; i < offers.length; i++) {
    if (offers[i].type.toLowerCase() === pointTypeName.toLowerCase()) {
      for (let j = 0; j < offers[i].offers.length; j++) {
        offersList += `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offers[i].offers[j].id}"
            type="checkbox" name="event-offer-${offers[i].offers[j].id}">
            <label class="event__offer-label" for="event-offer-${offers[i].offers[j].id}">
              <span class="event__offer-title">${offers[i].offers[j].title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offers[i].offers[j].price}</span>
            </label>
          </div>
        `;
      }
    }
  }

  return offersList;
}


function createUpdatePointTemplate() {
  const defaultPointTypeName = 'Flight';
  const defaultDestinationName = 'Chamonix';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${getPointTypesList(defaultPointTypeName)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${defaultPointTypeName}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${defaultDestinationName}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getDestinationsList()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${getAvailableOffers('Flight')}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${getDestinationByName('Chamonix').description}</p>
          </section>
        </section>
      </form>
    </li>
  `;
}

export default class UpdatePointView extends AbstractView {
  get template() {
    return createUpdatePointTemplate();
  }
}
