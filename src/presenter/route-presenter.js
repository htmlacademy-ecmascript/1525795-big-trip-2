import RouteView from '../view/route-view.js';
import RouteModel from '../model/route-model.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';
import HeaderPresenter from './header-presenter.js';

import { DEFAULT_SORT_TYPE, sortMethods, UpdateType } from '../utils/common.js';

import { render, remove } from '../framework/render.js';


export default class RoutePresenter {
  routeContainer = null;
  #routeComponent = new RouteView(); // routeComponent - это место на странице (<ul></ul>), куда будут вставляться точки маршрута
  #route = null;
  #routeData = null; // routeData - это исходные сгенерированные/полученные с сервера данные для отображения
  #pointMap = new Map();
  #headerPresenter = null;
  #sortPresenter = null;
  #currentSortType = DEFAULT_SORT_TYPE;

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
    this.#route = new RouteModel();
    this.#routeData = [...this.#route.route];
    this.#headerPresenter = new HeaderPresenter(this.#route);
    this.#sortPresenter = new SortPresenter(this.#routeData, this.routeContainer);

    this.#route.addObserver(this.#handleRouteEvent);
  }

  init() {
    // Добавляем на страницу компонент маршрута
    render(this.#routeComponent, this.routeContainer);

    // Сортируем точки маршрута
    this.#routeData.sort(sortMethods[this.#currentSortType]);
    // ... и отрисовываем маршрут
    this.#renderRoute();
  }

  #handleRouteEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.HEADER:
        // Обновляем только заголовок страницы - информацию о маршруте
        this.#headerPresenter.refreshHeader();
        break;
      case UpdateType.POINT:
        // Только перерисовываем строку с точкой машрута (при клике на favorite)
        this.#rerenderPoint(point);
        break;
      case UpdateType.ALL:
        // Подгружаем новый список точек маршрута
        this.#routeData = [...this.#route.route];
        // Сортируем в соответствии с текущим способом сортировки
        this.#routeData.sort(sortMethods[this.#currentSortType]);

        this.#headerPresenter.refreshHeader();
        this.#renderRoute();
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

  #filterTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      // // console.log(evt.target.dataset.sortType, this.#currentSortType);
      // if (evt.target.dataset.sortType !== this.#currentSortType) {
      //   this.#routeData.sort(sortMethods[evt.target.dataset.sortType]);
      //   this.#renderRoute();
      //   this.#currentSortType = evt.target.dataset.sortType;
      //   // console.log(this.#currentSortType);
      // }
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

  #renderRoute() {
    remove(this.#routeComponent);
    if (this.#routeData.length) {
      this.#routeComponent = new RouteView();
      render(this.#routeComponent, this.routeContainer);

      this.#routeData.forEach((item) => this.#renderPoint(item));

      document.addEventListener('keydown', this.#escKeydownHandler);
      document.querySelector('.trip-events__trip-sort').addEventListener('click', this.#sortTypeClickHandler);
      document.querySelector('.trip-events__trip-sort').addEventListener('click', this.#filterTypeClickHandler);
    } else {
      this.#headerPresenter.removeComponent();
      this.#sortPresenter.removeComponent();
      this.#routeComponent = new EmptyRouteView();
      render(this.#routeComponent, this.routeContainer);
    }
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
}
