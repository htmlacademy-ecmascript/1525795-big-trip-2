import Observable from '../framework/observable.js';
import { sortByDate } from '../utils/common.js';
import { getFormattedRangeDate } from '../util.js';
import { FilterType, SortMethods } from '../utils/common.js';

import { destinationModel } from '../main.js';
import { offerModel } from '../main.js';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';


export default class RouteModel extends Observable {
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
    const points = await this.#routeApiService.points;
    this.#route = points.map(this.#convertToInnerFormat);
  }

  get route() {
    return this.#route;
  }

  getRouteData(currentFilter, currentSortType) {
    // Получаем данные из модели
    let routeData = this.#route;

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

  // async addPoint(point, updateComponent) {
  //   const headers = new Headers();
  //   headers.append('Authorization', 'Basic qqefghijklmno');

  //   const convertedPoint = this.#convertToOuterFormat(point);
  //   delete convertedPoint.id;

  //   console.log(convertedPoint);
  //   await fetch('https://22.objects.htmlacademy.pro/big-trip/points', {method: 'POST', body: JSON.stringify(convertedPoint), headers: headers})
  //     .then((response) => {
  //       console.log(response, response.ok);
  //       if (!response.ok) {
  //         updateComponent.shake();
  //       } else {
  //         this.#route.push(this.#convertToInnerFormat(response));
  //         this._notify();
  //       }
  //     });
  // }

  async addPoint(point, updateComponent) {
    try {
      const convertedPoint = this.#convertToOuterFormat(point);
      delete convertedPoint.id;

      const response = await this.#routeApiService.addPoint(convertedPoint);
      this.#route.push(this.#convertToInnerFormat(response));
      this._notify();
    } catch(err) {
      // eslint-disable-next-line no-console
      console.log(err.name, err.message);

      updateComponent.shake();
    }
  }

  async updatePoint(point, updateComponent) {
    const idx = this.#route.findIndex((routePoint) => routePoint.id === point.id);

    if (idx === -1) {
      // Nothing to update
      return false;
    }

    try {
      const convertedPoint = this.#convertToOuterFormat({...point});
      const response = await this.#routeApiService.updatePoint(convertedPoint);
      const updatedPoint = await this.#convertToInnerFormat(response);
      this.#route = [...this.#route.slice(0, idx), updatedPoint, ...this.#route.slice(idx + 1)];
      this._notify();
      // cbRerenderRowComponent(updatedPoint);
    } catch(err) {
      updateComponent.shake();
    }
  }

  async deletePoint(point, updateComponent) {
    const idx = this.#route.findIndex((routePoint) => routePoint.id === point.id);

    if (idx === -1) {
      // Nothing to delete
      return false;
    }

    try {
      await this.#routeApiService.deletePoint(point.id);
      this.#route = [...this.#route.slice(0, idx), ...this.#route.slice(idx + 1)];

      this._notify();
    } catch (err) {
      updateComponent.shake();
    }
  }

  async toggleFavorite(point, rowComponent, cbRerenderRowComponent) {
    const idx = this.#route.findIndex((routePoint) => routePoint.id === point.id);
    if (idx === -1) {
      // Nothing to update
      return false;
    }

    try {
      const convertedPoint = this.#convertToOuterFormat({...point, isFavorite: !point.isFavorite});
      const response = await this.#routeApiService.updatePoint(convertedPoint);
      const updatedPoint = this.#convertToInnerFormat(response);
      this.#route = [...this.#route.slice(0, idx), updatedPoint, ...this.#route.slice(idx + 1)];
      cbRerenderRowComponent(updatedPoint);
    } catch (err) {
      rowComponent.shake();
    }
  }

  getRouteTitle() {
    if (!this.#route.length) {
      return '';
    }

    const pointsList = new Array();
    this.#route.forEach((item) =>
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
