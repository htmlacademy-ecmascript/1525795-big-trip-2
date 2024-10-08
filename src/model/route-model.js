import { getRandomPoint } from '../mock/gen-point.js';

const POINT_COUNT = 8;


const getEventLength = (dateFrom, dateTo) => {
  const startDateTime = new Date(dateFrom);
  const endDateTime = new Date(dateTo);

  return endDateTime - startDateTime;
};


const getEventStartDate = (dateFrom) => new Date(dateFrom);


export const sortByPrice = (a, b) => b.base_price - a.base_price;


export const sortByDate = (a, b) => getEventStartDate(a.date_from) - getEventStartDate(b.date_from);


export const sortByTime = (a, b) => getEventLength(b.date_from, b.date_to) - getEventLength(a.date_from, a.date_to);

export default class RouteModel {
  route = Array.from({length: POINT_COUNT}, getRandomPoint);

  getRoute() {
    this.route.sort(sortByPrice);

    return this.route;
  }
}
