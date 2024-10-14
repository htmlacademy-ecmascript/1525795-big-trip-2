import AbstractView from '../framework/view/abstract-view.js';
import { getPointTypeByName } from '../mock/point-type.js';
import { getDestinationById } from '../mock/destination.js';
import { getFormattedDate } from '../util.js';
import { getOfferById } from '../mock/offer.js';


const getFormattedLength = (eventLength) => {
  // Из разницы в датах убираем миллисекунды и секунды
  eventLength = eventLength / 1000 / 60;
  // Вычисляем разницу в днях, часах, минутах
  const days = Math.floor(eventLength / 1440);
  const hours = Math.floor((eventLength - days * 1440) / 60);
  const minutes = eventLength % 60;

  let formattedLength = '';
  if (days) {
    formattedLength += `${String(days)}D `;
  }

  formattedLength += `${String(hours).padStart(2, '0')}H `;

  formattedLength += `${String(minutes).padStart(2, '0')}M`;

  return formattedLength;
};


function createRoutePointTemplate(routePoint) {
  const { type: pointType, destination, date_from: dateFrom, date_to: dateTo, base_price: price, offers: pointOffers } = routePoint;
  const startDate = dateFrom.split('T')[0];
  const formattedStartDate = getFormattedDate(startDate);
  const startTime = dateFrom.split('T')[1].slice(0, 5);
  const endTime = dateTo.split('T')[1].slice(0, 5);

  const startDateTime = new Date(dateFrom);
  const endDateTime = new Date(dateTo);
  const formattedEventLength = getFormattedLength(new Date(endDateTime - startDateTime));

  const pointTypeItem = getPointTypeByName(pointType);
  const destinationItem = getDestinationById(destination);

  let offersList = '';
  if (pointOffers && pointOffers.length) {
    for (let i = 0; i < pointOffers.length; i++) {
      const offerItem = getOfferById(pointOffers[i]);
      offersList += `
        <li class="event__offer">
        <span class="event__offer-title">${offerItem.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerItem.price}</span>
      </li>
    `;
    }
  }

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startDate}">${formattedStartDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointTypeItem.name.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointTypeItem.name} ${destinationItem.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${formattedEventLength}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersList}
        </ul>
        <button class="event__favorite-btn event__favorite-btn--active" type="button">
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

export default class RoutePointView extends AbstractView {
  constructor(routePoint) {
    super();
    this.routePoint = routePoint;
  }

  get template() {
    return createRoutePointTemplate(this.routePoint);
  }
}
