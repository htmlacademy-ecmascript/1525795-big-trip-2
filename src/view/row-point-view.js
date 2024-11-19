import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { replace } from '../framework/render.js';

import { destinationModel } from '../main.js';
import { offerModel } from '../main.js';
import { StateType } from '../utils/common.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

function createRowPointTemplate(routePoint) {
  const { id, type: pointType, destination, dateFrom, dateTo, basePrice, isFavorite, offers } = routePoint;
  let startDate = null;
  let endDate = null;
  let formattedStartDate = '';
  let startTime = '';
  let endTime = '';
  let diffDate = null;
  let formattedEventLength = '';
  if (id !== 0) {
    startDate = dayjs(dateFrom).utc();
    endDate = dayjs(dateTo).utc();
    formattedStartDate = startDate.format('MMM DD');
    startTime = startDate.format('HH:mm');
    endTime = endDate.format('HH:mm');
    diffDate = dayjs(endDate - startDate).utc();
    const daysCount = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24).toString().padStart(2, '0');
    // formattedEventLength = `${diffDate.format('DD')}D ${diffDate.format('HH')}H ${diffDate.format('mm')}M`;
    formattedEventLength = `${daysCount}D ${diffDate.format('HH')}H ${diffDate.format('mm')}M`;
  }

  const destinationItem = destinationModel.getDestinationById(destination);

  let offersList = '';
  if (offers && offers.length) {
    for (const pointOffer of offers) {
      const offerItem = offerModel.getOfferById(pointType, pointOffer);

      if (offerItem) {
        offersList += `
          <li class="event__offer">
            <span class="event__offer-title">${('title' in offerItem) ? offerItem.title : ''}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offerItem.price}</span>
          </li>
        `;
      }
    }
  }

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startDate}">${formattedStartDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType === undefined ? '' : pointType.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointType === undefined ? '' : pointType} ${destinationItem === undefined ? '' : destinationItem.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${formattedEventLength}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersList}
        </ul>
        <button class="event__favorite-btn ${ isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class RoutePointView extends AbstractStatefulView {
  #routePresenter = null;
  #routeModel = null;
  #point = null;

  constructor(routePresenter, routeModel, point) {
    super();
    this.#routePresenter = routePresenter;
    this.#routeModel = routeModel;
    this.#point = point;
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rowRolldownClickHandler);
  }

  get template() {
    return createRowPointTemplate(this.#point);
  }

  replaceRowToForm(updateComponent, rowComponent) {
    replace(updateComponent, rowComponent);
  }

  #favoriteClickHandler = async () => {
    this.#point = await this.#routeModel.toggleFavorite(this.#point);
    if (this.#point) {
      await this.updateElement({isFaforite: this.#point.isFavorite});
    } else {
      this.shake();
    }
  };


  #rowRolldownClickHandler = () => {
    this.#routePresenter.routeStateHandler(StateType.UPDATE_POINT_VIEW, this.#point);
  };
}
