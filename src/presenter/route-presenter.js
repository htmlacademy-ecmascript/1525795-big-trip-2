import RouteView from '../view/route-view.js';
import RoutePointView from '../view/route-point-view.js';
import RouteModel from '../model/route-model.js';
import { sortArray } from '../view/sort-view.js';
import SortView from '../view/sort-view.js';
import { sortByPrice } from '../view/sort-view.js';
import { getTripTitle, getTripDates, getTripCost } from '../utils/common.js';

import { render, remove } from '../framework/render.js';


export default class RoutePresenter {
  routeComponent = new RouteView();
  route = new RouteModel();
  routePoints = null;
  sortComponent = new SortView(this.routePoints);

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  #updateTripInfo() {
    document.querySelector('.trip-info__title').textContent = getTripTitle(this.routePoints);
    document.querySelector('.trip-info__dates').textContent = getTripDates(this.routePoints);
    document.querySelector('.trip-info__cost-value').textContent = getTripCost(this.routePoints);
  }

  #renderSort() {
    render(this.sortComponent, this.routeContainer, 'afterbegin');

    sortArray.forEach(({sortName, isDisabled, cb}) => {
      if (!isDisabled) {
        this.sortComponent.element.querySelector(`#sort-${sortName.toLowerCase()}`).addEventListener('click', () => {
          this.sortComponent.element.querySelector(`#sort-${sortName.toLowerCase()}`).checked = true;
          this.routePoints.sort(cb);
          this.#renderRoutePoints();
        });
      }
    });
  }


  init() {
    render(this.routeComponent, this.routeContainer);
    this.#renderSort();

    this.routePoints = this.route.route;

    this.routePoints.sort(sortByPrice);
    this.#renderRoutePoints();

    this.#updateTripInfo();
  }

  #renderRoutePoints() {
    remove(this.routeComponent);
    this.routeComponent = new RouteView();
    render(this.routeComponent, this.routeContainer);

    for (let i = 0; i < this.routePoints.length; i++) {
      render(new RoutePointView(this.routePoints[i]), this.routeComponent.element);
    }

  }
}
