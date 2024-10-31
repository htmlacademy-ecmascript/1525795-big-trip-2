import { getRandomPoint } from '../mock/gen-point.js';
import Observable from '../framework/observable.js';
import { getDestinationById } from '../mock/destination.js';
import { sortByDate } from '../utils/common.js';
import { getFormattedRangeDate } from '../util.js';
import { getOfferById } from '../mock/offer.js';

import dayjs from 'dayjs';

const POINT_COUNT = 8;


export default class RouteModel extends Observable {
  #route = Array.from({length: POINT_COUNT}, getRandomPoint);

  get route() {
    return this.#route;
  }

  addPoint(newPoint) {
    this.#route.push(newPoint);

    this._notify('UPDATE', newPoint);
  }

  updatePoint(updatePoint) {
    const idx = this.#route.findIndex((point) => point.id === updatePoint.id);

    if (idx === -1) {
      // Nothing to update
      return false;
    }

    this.#route = [...this.#route.slice(0, idx), updatePoint, ...this.#route.slice(idx + 1)];

    this._notify('UPDATE', updatePoint);
  }

  deletePoint(deletePoint) {
    const idx = this.#route.findIndex((point) => point.id === deletePoint.id);

    if (idx === -1) {
      // Nothing to delete
      return false;
    }

    this.#route = [...this.#route.slice(0, idx), ...this.#route.slice(idx + 1)];

    this._notify('UPDATE', deletePoint);
  }

  getRouteTitle() {
    const pointsList = new Array();
    this.#route.forEach((item) => pointsList.push(getDestinationById(item.destination).name));

    if (pointsList.length > 3) {
      return `${[pointsList[0]]} - ... - ${[pointsList[pointsList.length - 1]]}`;
    }

    return pointsList.join(' - ');
  }

  getRouteDates() {
    const copyRoute = this.#route.slice().sort(sortByDate);
    const startDate = dayjs(copyRoute[0].date_from);
    const endDate = dayjs(copyRoute.slice(-1)[0].date_to);

    return `${getFormattedRangeDate(startDate.date(), startDate.month() + 1, endDate.date(), endDate.month() + 1)}`;
  }

  getRouteCost() {
    // Здесь подсчет стоимости маршрута. Суммируется стоимость каждой точки маршрута плюс стоимость offers  для точки маршрута
    let cost = 0;

    for (const point of this.#route) {
      cost += point['base_price'];

      if (point.offers && point.offers.length) {
        for (const offer of point['offers']) {
          cost += getOfferById(offer).price;
        }
      }
    }

    return cost;
  }
}
