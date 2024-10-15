import RouteView from '../view/route-view.js';
import RouteModel from '../model/route-model.js';
import EmptyRouteView from '../view/empty-route.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';

import { sortMap } from '../utils/common.js';
import { getTripTitle, getTripDates, getTripCost } from '../utils/common.js';

import { render, remove } from '../framework/render.js';


export default class RoutePresenter {
  // routeComponent - это место на странице (<ul></ul>), куда будут вставляться точки маршрута
  #routeComponent = new RouteView();
  // route - это исходные сгенерированные/полученные с сервера данные для отображения
  #route = new RouteModel();
  #emptyRoute = null;
  #tripInfoComponent = null;
  #pointMap = new Map();

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  #updateTripInfo() {
    if (this.#route.route.length > 0) {
      const tripTitle = getTripTitle(this.#route.route);
      const tripDates = getTripDates(this.#route.route);
      const tripCost = getTripCost(this.#route.route);

      const divTripMain = document.querySelector('.trip-main');
      this.#tripInfoComponent = new TripInfoView(tripTitle, tripDates, tripCost);
      render(this.#tripInfoComponent, divTripMain, 'afterbegin');
    }
  }

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.#route.route.sort(sortMap.get(evt.target.dataset.sortType).sortMethod);
      this.#renderRoute();
    }
  };

  #renderSort() {
    const sortPresenter = new SortPresenter(this.#route, this.routeContainer);
    sortPresenter.init();
    document.querySelector('.trip-events__trip-sort').addEventListener('click', this.#sortTypeClickHandler);
  }

  #renderRoute() {
    remove(this.#routeComponent);
    this.#routeComponent = new RouteView();
    render(this.#routeComponent, this.routeContainer);

    for (let i = 0; i < this.#route.route.length; i++) {
      this.#renderPoint(this.#route.route[i]);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#routeComponent, point);
    pointPresenter.init(point);
    this.#pointMap.set(point.id, pointPresenter);
  }

  #renderEmptyRoute() {
    this.#emptyRoute = new EmptyRouteView();
    render(this.#emptyRoute, this.routeContainer);
  }

  init() {
    // Добавляем на страницу компонент маршрута
    render(this.#routeComponent, this.routeContainer);

    if (this.#route.route.length) {
      // ... и туда же компонент сортировки точек маршрута
      this.#renderSort();

      // Отрисовываем точки маршрута
      this.#renderRoute();

      // Обновляем информацию о маршруте в заголовке страницы
      this.#updateTripInfo();
    } else {
      // ... либо Click New Event to create your first point
      this.#renderEmptyRoute();
    }
  }
}
