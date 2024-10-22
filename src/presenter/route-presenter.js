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
  #routeData = new RouteModel(); // route - это исходные сгенерированные/полученные с сервера данные для отображения
  #emptyRoute = null;
  #pointMap = new Map();
  #headerPresenter = null;

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  init() {
    // Добавляем на страницу компонент маршрута
    render(this.#routeComponent, this.routeContainer);
    this.#routeData = [...this.#routeData.route];

    if (this.#routeData.length) {
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

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      if (evt.target.dataset.sortType !== curentSortType) {
        this.#routeData.sort(sortMethods[evt.target.dataset.sortType]);
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
    const sortPresenter = new SortPresenter(this.#routeData, this.routeContainer);
    sortPresenter.init();
    this.#routeData = this.#routeData.sort(DEFAULT_SORT_METHOD);

    document.querySelector('.trip-events__trip-sort').addEventListener('click', this.#sortTypeClickHandler);
  };

  #renderRoute() {
    remove(this.#routeComponent);
    this.#routeComponent = new RouteView();
    render(this.#routeComponent, this.routeContainer);

    this.#routeData.forEach((item) => this.#renderPoint(item));
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#routeComponent,
      point,
      this.#resetRoutePoints,
      this.#refreshHeader);
    pointPresenter.init(point);

    this.#pointMap.set(point.id, pointPresenter);
  }

  #renderHeader() {
    this.#headerPresenter = new HeaderPresenter(this.#routeData);
    this.#headerPresenter.init();
  }

  #refreshHeader = (point) => {
    // Вообще говоря, обновлять заголовок нужно безотносительно точки маршрута.
    // Пока мы не пишем данные в БД, поэтому такой костыль.
    // В дальнейшем необходимо обновлять заголовок после каждого обновления данных в БД
    const idx = this.#routeData.findIndex((item) => item.id === point.id);
    this.#routeData[idx] = point;
    this.#headerPresenter.refreshHeader(this.#routeData);
  };

  #renderEmptyRoute() {
    this.#emptyRoute = new EmptyRouteView();
    render(this.#emptyRoute, this.routeContainer);
  }
}
