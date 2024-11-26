import Observable from '../framework/observable.js';

import { uiBlocker } from '../main.js';
import { DEFAULT_SORT_METHOD, sortByDate } from '../utils/common.js';
import { getFormattedRangeDate } from '../util.js';
import { FilterType, SortMethods, StateType } from '../utils/common.js';

import { destinationModel } from '../main.js';
import { offerModel } from '../main.js';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';


export default class RouteModel extends Observable {
  #routeState = StateType.FAILED_LOAD;
  #routeApiService = null;
  #route = [];
  #emptyPoint = {
    id: 0,
    basePrice: 0,
    dateFrom: '',
    dateTo: '',
    destination: 0,
    isFavorite: false,
    offers: [],
    type: 'flight'
  };


  constructor(routeApiService) {
    super();
    this.#routeApiService = routeApiService;
  }

  async init() {
    try {
      const points = await this.#routeApiService.points;
      this.#route = points.map(this.#convertToInnerFormat);
      this.#routeState = StateType.SUCCESS;
    } catch (err) {
      this.#routeState = StateType.FAILED_LOAD;
      return false;
    }
  }

  get routeState() {
    return this.#routeState;
  }

  get route() {
    return this.#route;
  }

  getRouteData(currentFilter, currentSortType) {
    // Получаем данные из модели
    let routeData = [...this.#route];

    // Фильтруем
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
    if (currentSortType) {
      routeData.sort(SortMethods[currentSortType]);
    }

    return routeData;
  }

  getRouteLength = () => this.route.length;

  getEmptyPoint = () => this.#emptyPoint;

  async addPoint(point, updateComponent) {
    try {
      uiBlocker.block();
      const convertedPoint = this.#convertToOuterFormat(point);
      delete convertedPoint.id;

      const response = await this.#routeApiService.addPoint(convertedPoint);
      this.#route.push(this.#convertToInnerFormat(response));
      uiBlocker.unblock();
      this._notify();
    } catch(err) {
      uiBlocker.unblock();
      updateComponent.shake();
      updateComponent.setSaveButtonText('Save');
    }
  }

  async updatePoint(point, updateComponent) {
    const idx = this.#route.findIndex((routePoint) => routePoint.id === point.id);

    if (idx === -1) {
      // Nothing to update
      return false;
    }

    try {
      uiBlocker.block();
      const convertedPoint = this.#convertToOuterFormat({...point});
      const response = await this.#routeApiService.updatePoint(convertedPoint);
      const updatedPoint = await this.#convertToInnerFormat(response);
      this.#route = [...this.#route.slice(0, idx), updatedPoint, ...this.#route.slice(idx + 1)];
      uiBlocker.unblock();
      this._notify();
    } catch(err) {
      uiBlocker.unblock();
      updateComponent.shake();
      updateComponent.setSaveButtonText('Save');
    }
  }

  async deletePoint(point, updateComponent) {
    const idx = this.#route.findIndex((routePoint) => routePoint.id === point.id);

    if (idx === -1) {
      // Nothing to delete
      return false;
    }

    try {
      uiBlocker.block();
      await this.#routeApiService.deletePoint(point.id);
      this.#route = [...this.#route.slice(0, idx), ...this.#route.slice(idx + 1)];
      uiBlocker.unblock();
      this._notify();
    } catch (err) {
      uiBlocker.unblock();
      updateComponent.shake();
      updateComponent.setDeleteButtonText('Delete');
    }
  }

  async toggleFavorite(point) {
    const idx = this.#route.findIndex((routePoint) => routePoint.id === point.id);
    if (idx === -1) {
      // Nothing to update
      return false;
    }

    try {
      uiBlocker.block();
      const convertedPoint = this.#convertToOuterFormat({...point, isFavorite: !point.isFavorite});
      const response = await this.#routeApiService.updatePoint(convertedPoint);
      const updatedPoint = this.#convertToInnerFormat(response);
      this.#route = [...this.#route.slice(0, idx), updatedPoint, ...this.#route.slice(idx + 1)];
      uiBlocker.unblock();
      return updatedPoint;
    } catch (err) {
      uiBlocker.unblock();
      return false;
    }

  }

  getRouteTitle() {
    if (!this.#route.length) {
      return '';
    }

    // Заголовок составляем по отсортированной копии маршрута (не отфильтрованной!)
    const routeData = [...this.#route];
    routeData.sort(DEFAULT_SORT_METHOD);

    const pointsList = new Array();
    routeData.forEach((item) =>
      (destinationModel.getDestinationById(item.destination) === undefined ? '' : pointsList.push(destinationModel.getDestinationById(item.destination).name)));

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
    const startDate = new Date(copyRoute[0].dateFrom);
    const endDate = new Date(copyRoute.slice(-1)[0].dateTo);

    return `${getFormattedRangeDate(startDate.getUTCDate(), startDate.getUTCMonth() + 1, endDate.getUTCDate(), endDate.getUTCMonth() + 1)}`;
  }

  getRouteCost() {
    if (!this.#route.length) {
      return 0;
    }

    // Здесь подсчет стоимости маршрута. Суммируется стоимость каждой точки маршрута плюс стоимость offers  для точки маршрута
    let cost = 0;
    for (const point of this.#route) {
      cost += point.basePrice;

      if (point.offers) {
        for (const offer of point.offers) {
          const pointOffer = offerModel.getOfferById(point.type, offer);
          if (pointOffer) {
            cost += pointOffer.price;
          }
        }
      }
    }

    return cost;
  }

  #convertToInnerFormat(item) {
    const convertedPoint = {...item,
      basePrice: item['base_price'],
      dateFrom: item['date_from'],
      dateTo: item['date_to'],
      isFavorite: item['is_favorite']};

    delete convertedPoint['base_price'];
    delete convertedPoint['date_from'];
    delete convertedPoint['date_to'];
    delete convertedPoint['is_favorite'];

    return convertedPoint;
  }

  #convertToOuterFormat(item) {
    const convertedPoint = {...item,
      'base_price': item.basePrice,
      'date_from': item.dateFrom,
      'date_to': item.dateTo,
      'is_favorite': item.isFavorite};

    delete convertedPoint.basePrice;
    delete convertedPoint.dateFrom;
    delete convertedPoint.dateTo;
    delete convertedPoint.isFavorite;

    return convertedPoint;
  }
}
