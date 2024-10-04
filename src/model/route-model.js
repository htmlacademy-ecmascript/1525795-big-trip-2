import { getRandomPoint } from '../mock/gen-point.js';

const POINT_COUNT = 8;

export default class RouteModel {
  route = Array.from({length: POINT_COUNT}, getRandomPoint);

  getRoute() {
    return this.route;
  }
}
