import { getRandomPoint } from '../mock/gen-point.js';
import Observable from '../framework/observable.js';
import { getDestinationById } from '../mock/destination.js';
import { sortByDate } from '../utils/common.js';
import { getFormattedRangeDate } from '../util.js';
import { getOfferById } from '../mock/offer.js';
import { FilterType, sortMethods } from '../utils/common.js';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

const POINT_COUNT = 4;


export default class RouteModel extends Observable {
  #route = Array.from({length: POINT_COUNT}, getRandomPoint);

  get route() {
    return this.#route;
  }

  getRouteData(currentFilter, currentSortType) {
    // Получаем данные из модели
    let routeData = [...this.#route];

    // Фильтруем
    // console.log('inside getRouteData', currentFilter);
    switch (currentFilter) {
      case FilterType.EVERYTHING:
        break;
      case FilterType.FUTURE:
        routeData = routeData.filter((item) => dayjs(item.dateFrom) > dayjs());
        break;
      case FilterType.PRESENT:
        dayjs.extend(isBetween);
        routeData = routeData.filter((item) => dayjs().isBetween(item.dateFrom, item.dateTo));
        break;
      case FilterType.PAST:
        routeData = routeData.filter((item) => dayjs(item.dateTo) <= dayjs());
        break;
    }

    // Сортируем
    routeData.sort(sortMethods[currentSortType]);

    return routeData;
  }

  addPoint(point) {
    this.#route.push(point);

    this._notify();
  }

  updatePoint(updateType, point) {
    const idx = this.#route.findIndex((routePoint) => routePoint.id === point.id);

    if (idx === -1) {
      // Nothing to update
      return false;
    }

    this.#route = [...this.#route.slice(0, idx), point, ...this.#route.slice(idx + 1)];

    this._notify(updateType);
  }

  deletePoint(updateType, point) {
    const idx = this.#route.findIndex((routePoint) => routePoint.id === point.id);

    if (idx === -1) {
      // Nothing to delete
      return false;
    }

    this.#route = [...this.#route.slice(0, idx), ...this.#route.slice(idx + 1)];

    this._notify(updateType);
  }

  changeFavorite(updateType, point) {
    for (const routePoint of this.#route) {
      if (routePoint.id === point.id) {
        routePoint.isFavorite = !routePoint.isFavorite;
      }
    }

    this._notify(updateType, point);
  }

  getRouteTitle() {
    if (!this.#route.length) {
      return '';
    }

    const pointsList = new Array();
    this.#route.forEach((item) => pointsList.push(getDestinationById(item.destination).name));

    if (pointsList.length > 3) {
      return `${[pointsList[0]]} - ... - ${[pointsList[pointsList.length - 1]]}`;
    }

    return pointsList.join(' - ');
  }

  getRouteDates() {
    if (!this.#route.length) {
      return '';
    }

    const copyRoute = this.#route.slice().sort(sortByDate);
    const startDate = dayjs(copyRoute[0].dateFrom);
    const endDate = dayjs(copyRoute.slice(-1)[0].dateTo);

    return `${getFormattedRangeDate(startDate.date(), startDate.month() + 1, endDate.date(), endDate.month() + 1)}`;
  }

  getRouteCost() {
    if (!this.#route.length) {
      return 0;
    }

    // Здесь подсчет стоимости маршрута. Суммируется стоимость каждой точки маршрута плюс стоимость offers  для точки маршрута
    let cost = 0;

    for (const point of this.#route) {
      cost += point.basePrice;

      if (point.offers && point.offers.length) {
        for (const offer of point.offers) {
          cost += getOfferById(offer).price;
        }
      }
    }

    return cost;
  }
}
