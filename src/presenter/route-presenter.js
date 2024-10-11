import RouteView from '../view/route-view.js';
import RoutePointView from '../view/route-point-view.js';
import RouteModel from '../model/route-model.js';
import { sortArray } from '../view/sort-view.js';
import SortView from '../view/sort-view.js';
// import UpdatePointView from '../view/update-point-view.js';
import { getDestinationById } from '../mock/destination.js';
import { sortByDate, sortByPrice } from '../view/sort-view.js';
import { getFormattedRangeDate } from '../util.js';
import { getOfferById } from '../mock/offer.js';

import { render, remove } from '../framework/render.js';


export default class RoutePresenter {
  routeComponent = new RouteView();
  route = new RouteModel();
  routePoints = null;
  sortComponent = new SortView(this.routePoints);

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  getTripTitle() {
    const copyRoutePoints = this.routePoints.slice();
    const routeDestinations = Array.from(copyRoutePoints, (item) => getDestinationById(item.destination).name);
    const uniqueDestinations = new Set(routeDestinations);

    return Array.from(uniqueDestinations, (item) => item).join(' - ');
  }

  getTripDates() {
    const copyRoutePoints = this.routePoints.slice().sort(sortByDate);
    const startDate = new Date(copyRoutePoints[0].date_from);
    const endDate = new Date(copyRoutePoints.slice(-1)[0].date_to);

    return `${getFormattedRangeDate(startDate.getDate(), startDate.getMonth() + 1, endDate.getDate(), endDate.getMonth() + 1)}`;
  }

  getTripCost() {
    let cost = 0;
    // С вложенным reduce слишком не читаемое будет выражение
    for (let i = 0; i < this.routePoints.length; i++) {
      cost += this.routePoints[i].base_price;

      if (this.routePoints[i].offers && this.routePoints[i].offers.length) {
        for (let j = 0; j < this.routePoints[i].offers.length; j++) {
          cost += getOfferById(this.routePoints[i].offers[j]).price;
        }
      }
    }

    return cost;
  }

  updateTripInfo() {
    document.querySelector('.trip-info__title').textContent = this.getTripTitle();
    document.querySelector('.trip-info__dates').textContent = this.getTripDates();
    document.querySelector('.trip-info__cost-value').textContent = this.getTripCost();
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

    this.routePoints = this.route.getRoute();

    this.routePoints.sort(sortByPrice);
    this.#renderRoutePoints();

    this.updateTripInfo();
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
