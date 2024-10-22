import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import { pointTypes } from '../mock/point-type.js';
import { destinations, getDestinationById, getDestinationByName } from '../mock/destination.js';
import { offers } from '../mock/offer.js';
import { replace } from '../framework/render.js';

import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


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

function getDestinationPhotos(destination) {
  let photos = '';

  if (destination.pictures.length) {
    destination.pictures.forEach((item) => {
      photos += `<img class="event__photo" src=${item.src} alt="Event photo">`;
    });
  }

  return photos;
}

function getFormattedDestination(destinationObj) {
  return `
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destinationObj.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${getDestinationPhotos(destinationObj)}
      </div>
    </div>
  `;
}


function getDestinationsList() {
  // Список пунктов назначения для выпадающего списка в форме редактирования
  let destinationsList = '';
  for (let i = 0; i < destinations.length; i++) {
    destinationsList += `<option value="${destinations[i].name}"></option>`;
  }
  return destinationsList;
}


function getFormattedOffers(pointTypeName, pointOffers) {
  // Список дополнительных опций для вида точки маршрута
  let offersList = '';

  for (let i = 0; i < offers.length; i++) {
    if (offers[i].type.toLowerCase() === pointTypeName.toLowerCase()) {
      if (offers[i].offers.length > 0) {
        offersList += `
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
        `;
      }
    }
  }

  return offersList;
}


function createUpdatePointTemplate(state) {
  const pointTypeName = state.type;
  const dateFrom = dayjs(state.date_from).format('DD/MM/YY HH:mm');
  const dateTo = dayjs(state.date_to).format('DD/MM/YY HH:mm');
  const destinationObj = getDestinationById(state.destination);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${state.id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointTypeName.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${state.id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${getPointTypesList(pointTypeName)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${state.id}">
              ${pointTypeName}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${state.id}" type="text" name="event-destination"
            value="${destinationObj.name}" list="destination-list-${state.id}">
            <datalist id="destination-list-${state.id}">
              ${getDestinationsList()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${state.id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${state.id}" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${state.id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${state.id}" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${state.id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${state.id}" type="text" name="event-price" value="${state.base_price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            ${getFormattedOffers(pointTypeName, state.offers && state.offers.length ? state.offers : [])}
          </section>

          <section class="event__section  event__section--destination">
            ${getFormattedDestination(destinationObj)}
          </section>
        </section>
      </form>
    </li>
  `;
}

export default class UpdatePointView extends AbstractStatefulView {
  #routePoint = null;
  #cbRollupClickHandler = null;
  #cbSubmitClickHandler = null;
  #startDatePicker = null;
  #endDatePicker = null;

  constructor(routePoint, cbRollupClickHandler, cbSubmitClickHandler) {
    super();
    this.#routePoint = routePoint;
    this.#cbRollupClickHandler = cbRollupClickHandler;
    this.#cbSubmitClickHandler = cbSubmitClickHandler;
    this._setState(UpdatePointView.parsePointToState(this.#routePoint));

    this._restoreHandlers();
  }

  get template() {
    return createUpdatePointTemplate(this._state);
  }

  replaceFormToRow(rowComponent, updateComponent) {
    replace(rowComponent, updateComponent);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formRollupClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#cbSubmitClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);

    this.#setDatePicker();
  }

  #formRollupClickHandler = () => {
    this.updateElement(UpdatePointView.parsePointToState(this.#routePoint));
    this.#cbRollupClickHandler();
  };

  #eventTypeChangeHandler = () => {
    const newPointTypeName = this.element.querySelector('input[name="event-type"]:checked').value;
    this.updateElement({type: newPointTypeName});
  };

  #destinationChangeHandler = () => {
    if (this.element.querySelector('.event__input--destination').value) {
      const newDestination = this.element.querySelector('.event__input--destination').value;
      this.updateElement({destination: getDestinationByName(newDestination).id});
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({'base_price': parseInt(evt.target.value, 10)});
  };

  removeElement() {
    super.removeElement();

    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  }

  #setDatePicker() {
    if (this._state['date_from']) {
      this.#startDatePicker = flatpickr(
        this.element.querySelector('input[name="event-start-time"]'),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state['date_from'],
          onChange: this.#startDateChangeHandler
        }
      );
    }

    if (this._state['date_to']) {
      this.#endDatePicker = flatpickr(
        this.element.querySelector('input[name="event-end-time"]'),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state['date_to'],
          onChange: this.#endDateChangeHandler
        }
      );
    }
  }

  #startDateChangeHandler = ([startDate]) => {
    this.updateElement({'date_from': startDate});
  };

  #endDateChangeHandler = ([endDate]) => {
    this.updateElement({'date_to': endDate});
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    const point = {...state};

    return point;
  }
}
