import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { PointTypes } from '../utils/common.js';
import { destinationModel } from '../main.js';
import { offerModel } from '../main.js';
import { ActionType } from '../utils/common.js';
import NewEventView from './new-event-view.js';

import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


function getPointTypesList(defaultPointTypeName) {
  // Список видов точек маршрута
  let pointTypesList = '';
  for (const item of Object.values(PointTypes)) {
    const checked = item.toLowerCase() === defaultPointTypeName.toLowerCase() ? 'checked' : '';
    pointTypesList += `
      <div class="event__type-item">
        <input id="event-type-${item.toLowerCase()}-1" class="event__type-input  visually-hidden"
        type="radio" name="event-type" value="${item.toLowerCase()}" ${checked}>
        <label class="event__type-label  event__type-label--${item.toLowerCase()}"
        for="event-type-${item.toLowerCase()}-1">${item}</label>
      </div>`;
  }
  return pointTypesList;
}

function getDestinationPhotos(destination) {
  let photos = '';

  if (destination && destination.pictures && destination.pictures.length) {
    photos += `
      <div class="event__photos-container">
        <div class="event__photos-tape">`;

    destination.pictures.forEach((item) => {
      photos += `<img class="event__photo" src=${item.src} alt="Event photo">`;
    });

    photos += `
        </div>
      </div>`;
  }

  return photos;
}

function getFormattedDestination(destinationObj) {
  let destination = '';

  if (destinationObj !== undefined && destinationObj.description) {
    destination += `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationObj.description}</p>
          ${getDestinationPhotos(destinationObj)}
      </section>`;
  }
  return destination;
}


function getDestinationsList() {
  const destinations = destinationModel.destinations;
  // Список пунктов назначения для выпадающего списка в форме редактирования
  let destinationsList = '';
  for (const item of destinations) {
    destinationsList += `<option value="${item.name}"></option>`;
  }
  return destinationsList;
}


function getFormattedOffers(pointTypeName, pointOffers) {
  const offers = offerModel.offers;
  // Список дополнительных опций для вида точки маршрута
  const offersItem = offers.find((item) => item['type'] === pointTypeName);
  if (offersItem === undefined) {
    return '';
  }

  const copyOffers = offersItem.offers;
  let offersList = '';

  if (copyOffers && copyOffers.length) {
    offersList = '<section class="event__section  event__section--offers">';

    offersList += `
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
    `;

    copyOffers.forEach((item) => {
      offersList += `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.id}"
          type="checkbox" name="event-offer-${item.id}" ${pointOffers.includes(item.id) ? 'checked' : ''}
          data-offer-id=${item.id}>
          <label class="event__offer-label" for="event-offer-${item.id}">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
          </label>
        </div>
      `;
    });

    offersList += `
        </div>
      </section>
    `;
  }

  return offersList;
}


function createUpdatePointTemplate(state, actionType) {
  const pointTypeName = state.type;
  const dateFrom = state.dateFrom ? dayjs(state.dateFrom).format('DD/MM/YY HH:mm') : '';
  const dateTo = state.dateTo ? dayjs(state.dateTo).format('DD/MM/YY HH:mm') : '';
  const destinationObj = destinationModel.getDestinationById(state.destination);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="GET">
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
            value="${destinationObj === undefined ? '' : destinationObj.name}" list="destination-list-${state.id}">
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
            <input class="event__input  event__input--price" id="event-price-${state.id}" type="text" name="event-price" value="${state.basePrice}">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${ actionType === ActionType.APPEND ? 'Cancel' : 'Delete'}</button>
          ${ actionType === ActionType.APPEND ? '' : '<button class="event__rollup-btn" type="button">' }
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${getFormattedOffers(pointTypeName, state.offers && state.offers.length ? state.offers : [])}

          ${getFormattedDestination(destinationObj)}
        </section>
      </form>
    </li>
  `;
}

export default class UpdatePointView extends AbstractStatefulView {
  #routePresenter = null;
  #routeModel = null;
  #point = null;
  #startDatePicker = null;
  #endDatePicker = null;
  #actionType = null;
  eventRollupButton = null;

  constructor(routePresenter, routeModel, point, actionType) {
    super();
    this.#routePresenter = routePresenter;
    this.#routeModel = routeModel;
    this.#point = point;
    this.#actionType = actionType;

    this._setState(UpdatePointView.parsePointToState(this.#point));

    this._restoreHandlers();
  }

  get template() {
    return createUpdatePointTemplate(this._state, this.#actionType);
  }

  _restoreHandlers() {
    // Получается, при каждом изменении в форме редактирования методом UpdateElement перерисовывается страница
    // Соответственно, перед восстановлением хэндлеров необходимо заново инициализировать переменные с элементами формы
    // Надеюсь, в React будет проще??
    this.eventRollupButton = this.element.querySelector('.event__rollup-btn');
    this.eventEdit = this.element.querySelector('.event--edit');
    this.eventTypeGroup = this.element.querySelector('.event__type-group');
    this.eventInputDestination = this.element.querySelector('.event__input--destination');
    this.eventAvailableOffers = this.element.querySelector('.event__available-offers');
    this.eventInputPrice = this.element.querySelector('.event__input--price');
    this.eventSaveButton = this.element.querySelector('.event__save-btn');
    this.eventResetButton = this.element.querySelector('.event__reset-btn');
    this.eventAddButton = new NewEventView();
    this.eventStartTime = this.element.querySelector('input[name="event-start-time"]');
    this.eventEndTime = this.element.querySelector('input[name="event-end-time"]');


    document.addEventListener('keydown', this.#escKeydownHandler);
    if (this.#actionType !== ActionType.APPEND) {
      this.eventRollupButton.addEventListener('click', this.#formRollupClickHandler);
    }
    this.eventEdit.addEventListener('submit', this.#submitClickHandler);
    this.eventTypeGroup.addEventListener('change', this.#eventTypeChangeHandler);
    this.eventInputDestination.addEventListener('change', this.#destinationChangeHandler);
    if (this.eventAvailableOffers !== null) {
      this.eventAvailableOffers.addEventListener('click', this.#offersChangeHandler);
    }
    this.eventInputPrice.addEventListener('change', this.#priceChangeHandler);
    this.eventResetButton.addEventListener('click', this.#deletePointHandler);

    this.#setDatePicker();
  }


  #eventTypeChangeHandler = () => {
    const newPointTypeName = this.element.querySelector('input[name="event-type"]:checked').value;
    this._state.offers = [];
    this.updateElement({type: newPointTypeName, offers: []});
  };

  #destinationChangeHandler = () => {
    if (this.eventInputDestination.value) {
      const newDestination = this.eventInputDestination.value;
      const destinationObj = destinationModel.getDestinationByName(newDestination);
      if (destinationObj === undefined) {
        // Возвращаем исходное значение
        this.eventInputDestination.value = destinationModel.getDestinationById(this._state.destination).name;
        return null;
      }

      this.updateElement({destination: destinationObj.id});
    }
  };

  #offersChangeHandler = (evt) => {
    const selectedOfferId = evt.target.dataset.offerId;
    if (!selectedOfferId) {
      return;
    }

    if (this._state.offers.includes(selectedOfferId)) {
      this._state.offers = this._state.offers.filter((item) => item !== selectedOfferId);
    } else {
      this._state.offers.push(selectedOfferId);
    }
    this.updateElement({offers: this._state.offers});
  };

  #priceChangeHandler = (evt) => {
    const price = Number(evt.target.value);
    if (!price || price <= 0) {
      evt.target.value = this._state.basePrice;
      return false;
    }

    this._setState({basePrice: price});
  };

  #formRollupClickHandler = () => {
    this.removeDatePickr();
    this.eventAddButton.enable();
    this.#routePresenter.routeStateHandler();
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.removeDatePickr();
      this.eventAddButton.enable();
      this.#routePresenter.routeStateHandler();
    }
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.setSaveButtonText('Saving...');
    this.#point = this._state;

    if (this.#actionType === ActionType.APPEND) {
      this.#routeModel.addPoint(this.#point, this);
    } else {
      this.#routeModel.updatePoint(this.#point, this);
    }
    this.eventAddButton.enable();
  };

  #deletePointHandler = () => {
    this.setDeleteButtonText('Deleting...');
    this.removeDatePickr();
    if (this.#actionType === ActionType.APPEND) {
      // При добавлении новой точки - это Cancel
      this.eventAddButton.enable();
      this.#routePresenter.routeStateHandler();
    } else {
      // При редактировании точки - это Delete
      this.#routeModel.deletePoint(this.#point, this);
    }
  };

  setSaveButtonText = (buttonText) => {
    this.eventSaveButton.textContent = buttonText;
  };

  setDeleteButtonText = (buttonText) => {
    this.eventResetButton.textContent = buttonText;
  };

  removeElement() {
    super.removeElement();
    this.removeDatePickr();
  }

  removeDatePickr = () => {
    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  };

  #setDatePicker() {
    this.#startDatePicker = flatpickr(
      this.eventStartTime,
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        onChange: this.#startDateChangeHandler
      }
    );

    this.#endDatePicker = flatpickr(
      this.eventEndTime,
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        onChange: this.#endDateChangeHandler
      }
    );
  }

  #startDateChangeHandler = ([startDate]) => {
    if (this._state.dateTo && startDate >= this._state.dateTo) {
      this.eventStartTime.value = '';
    }
    this.eventStartTime.setAttribute('value', dayjs(startDate).format('DD/MM/YY HH:mm'));
    this._setState({dateFrom: startDate});
  };

  #endDateChangeHandler = ([endDate]) => {
    if (this._state.dateFrom && endDate <= this._state.dateFrom) {
      this.eventEndTime.value = '';
      return;
    }
    this.eventEndTime.setAttribute('value', dayjs(endDate).format('DD/MM/YY HH:mm'));
    this._setState({dateTo: endDate});
  };

  static parsePointToState(point) {
    return {...point};
  }
}
