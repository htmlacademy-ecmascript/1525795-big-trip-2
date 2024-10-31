import RouteView from '../view/route-view.js';
import RouteModel from '../model/route-model.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';
import HeaderPresenter from './header-presenter.js';

import { DEFAULT_SORT_TYPE, DEFAULT_SORT_METHOD, sortMethods, UpdateType } from '../utils/common.js';

import { render, remove } from '../framework/render.js';


export default class RoutePresenter {
  routeContainer = null;
  #routeComponent = new RouteView(); // routeComponent - это место на странице (<ul></ul>), куда будут вставляться точки маршрута
  #route = new RouteModel();
  #routeData = [...this.#route.route]; // routeData - это исходные сгенерированные/полученные с сервера данные для отображения
  #emptyRoute = null;
  #pointMap = new Map();
  #headerPresenter = new HeaderPresenter(this.#route);
  #sortPresenter = null;
  #currentSortType = '';

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;

    this.#route.addObserver(this.#handleRouteEvent);
  }

  init() {
    // Добавляем на страницу компонент маршрута
    render(this.#routeComponent, this.routeContainer);

    if (this.#routeData.length) {
      // ... и туда же компонент сортировки точек маршрута
      this.#renderSort();
      this.#currentSortType = DEFAULT_SORT_TYPE;

      // Отрисовываем точки маршрута
      this.#renderRoute();

      // Обновляем информацию о маршруте в заголовке страницы
      this.#headerPresenter.init();
    } else {
      // ... либо Click New Event to create your first point, если маршрут пустой
      this.#renderEmptyRoute();
    }
  }

  #handleRouteEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.HEADER:
        this.#headerPresenter.refreshHeader();
        break;
      case UpdateType.POINT:
        this.#rerenderPoint(point);
        break;
    }
  };

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      if (evt.target.dataset.sortType !== this.#currentSortType) {
        this.#routeData.sort(sortMethods[evt.target.dataset.sortType]);
        this.#renderRoute();
        this.#currentSortType = evt.target.dataset.sortType;
      }
    }
  };

  // Для всех точек маршрута восстанавливаем исходный вид (превращаем в строку)
  #resetRoutePoints = () => this.#pointMap.forEach((item) => item.resetComponent());

  // Если поймали Esc, возвращаем исходный вид всех точек маршрута
  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#resetRoutePoints();
    }
  };

  #renderSort = () => {
    this.#sortPresenter = new SortPresenter(this.#routeData, this.routeContainer);
    this.#sortPresenter.init();
    this.#routeData = this.#routeData.sort(DEFAULT_SORT_METHOD);

    document.querySelector('.trip-events__trip-sort').addEventListener('click', this.#sortTypeClickHandler);
  };

  #renderRoute() {
    // Или сделать replace??
    remove(this.#routeComponent);
    this.#routeComponent = new RouteView();
    render(this.#routeComponent, this.routeContainer);

    this.#routeData.forEach((item) => this.#renderPoint(item));
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#route,
      this.#routeComponent,
      point,
      this.#resetRoutePoints);
    pointPresenter.init(point);

    this.#pointMap.set(point.id, pointPresenter);
  }

  #rerenderPoint(point) {
    const pointPresenter = this.#pointMap.get(point.id);
    pointPresenter.rerenderPoint(point);
  }

  #renderEmptyRoute() {
    this.#emptyRoute = new EmptyRouteView();
    render(this.#emptyRoute, this.routeContainer);
  }
}
