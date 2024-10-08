import { getRandomPoint } from '../mock/gen-point.js';

const POINT_COUNT = 8;

const sortByPrice = (a, b) => b.base_price - a.base_price;

export default class RouteModel {
  route = Array.from({length: POINT_COUNT}, getRandomPoint);

  getRoute() {
    this.route.sort(sortByPrice);

    return this.route;
  }
}
