import RouteView from '../view/route-view.js';
import RouteModel from '../model/route-model.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';
import HeaderPresenter from './header-presenter.js';

import { DEFAULT_SORT_TYPE, DEFAULT_SORT_METHOD, sortMethods } from '../utils/common.js';

import { render, remove } from '../framework/render.js';

let curentSortType = '';


export default class RoutePresenter {
  routeContainer = null;
  #routeComponent = new RouteView(); // routeComponent - это место на странице (<ul></ul>), куда будут вставляться точки маршрута
  #route = new RouteModel(); // route - это исходные сгенерированные/полученные с сервера данные для отображения
  #emptyRoute = null;
  #pointMap = new Map();

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      if (evt.target.dataset.sortType !== curentSortType) {
        this.#route.sort(sortMethods[evt.target.dataset.sortType]);
        this.#renderRoute();
        curentSortType = evt.target.dataset.sortType;
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
    const sortPresenter = new SortPresenter(this.#route, this.routeContainer);
    sortPresenter.init();
    this.#route = this.#route.sort(DEFAULT_SORT_METHOD);

    document.querySelector('.trip-events__trip-sort').addEventListener('click', this.#sortTypeClickHandler);
  };

  #updateFavorite = (point) => {
    const updatedPoint = this.#route.find((item) => item.id === point.id);
    updatedPoint['is_favorite'] = !updatedPoint['is_favorite'];
  };

  #renderRoute() {
    remove(this.#routeComponent);
    this.#routeComponent = new RouteView();
    render(this.#routeComponent, this.routeContainer);

    this.#route.forEach((item) => this.#renderPoint(item));
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#routeComponent, point, this.#updateFavorite, this.#resetRoutePoints);
    pointPresenter.init(point);

    this.#pointMap.set(point.id, pointPresenter);
  }

  #renderHeader() {
    const headerPresenter = new HeaderPresenter(this.#route);
    headerPresenter.init();
  }

  #renderEmptyRoute() {
    this.#emptyRoute = new EmptyRouteView();
    render(this.#emptyRoute, this.routeContainer);
  }

  init() {
    // Добавляем на страницу компонент маршрута
    render(this.#routeComponent, this.routeContainer);
    this.#route = [...this.#route.route];

    if (this.#route.length) {
      // ... и туда же компонент сортировки точек маршрута
      this.#renderSort();
      curentSortType = DEFAULT_SORT_TYPE;

      // Отрисовываем точки маршрута
      this.#renderRoute();

      // Обновляем информацию о маршруте в заголовке страницы
      this.#renderHeader();
    } else {
      // ... либо Click New Event to create your first point, если маршрут пустой
      this.#renderEmptyRoute();
    }
  }
}
