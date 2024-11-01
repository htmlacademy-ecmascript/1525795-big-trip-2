import RouteView from '../view/route-view.js';
import RouteModel from '../model/route-model.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';
import HeaderPresenter from './header-presenter.js';

import { DEFAULT_SORT_TYPE, filterType, sortMethods, UpdateType, filterEmptyMessage } from '../utils/common.js';

import { render, remove } from '../framework/render.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';


export default class RoutePresenter {
  routeContainer = null;
  headerContainer = null;
  #routeComponent = null;
  #route = null;
  #routeData = null;
  #pointMap = new Map();
  #headerPresenter = null;
  #filterPresenter = null;
  #sortPresenter = null;
  #currentFilterType = filterType.EVERYTHING;
  #currentSortType = DEFAULT_SORT_TYPE;

  constructor({routeContainer, headerContainer}) {
    this.headerContainer = headerContainer;
    this.routeContainer = routeContainer;

    this.#route = new RouteModel();
    this.#headerPresenter = new HeaderPresenter(this.#route);
    this.#filterPresenter = new FilterPresenter(this.#routeData, headerContainer);
    this.#sortPresenter = new SortPresenter(this.#routeData, this.routeContainer);

    document.querySelector('.trip-filters').addEventListener('click', this.#filterTypeClickHandler);
    this.#route.addObserver(this.#handleRouteEvent);
  }

  init() {
    // Получаем отфильтрованные и отсортированные данные
    this.#routeData = this.#getRouteData();

    // ... и отрисовываем маршрут
    this.#renderRoute();
  }

  #getRouteData = () => {
    // Получаем данные из модели
    let routeData = [...this.#route.route];

    // Фильтруем
    switch (this.#currentFilterType) {
      case filterType.EVERYTHING:
        break;
      case filterType.FUTURE:
        routeData = routeData.filter((item) => dayjs(item.dateFrom) > dayjs());
        break;
      case filterType.PRESENT:
        dayjs.extend(isBetween);
        routeData = routeData.filter((item) => dayjs().isBetween(item.dateFrom, item.dateTo));
        break;
      case filterType.PAST:
        routeData = routeData.filter((item) => dayjs(item.dateTo) <= dayjs());
        break;
    }

    // Сортируем
    routeData.sort(sortMethods[this.#currentSortType]);

    return routeData;
  };

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
        // Снова запрашиваем список точек из модели
        this.#routeData = this.#getRouteData();

        this.#headerPresenter.refreshHeader();
        this.#renderRoute();
        break;
    }
  };

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      if (evt.target.dataset.sortType !== this.#currentSortType) {
        this.#currentSortType = evt.target.dataset.sortType;
        this.#routeData = this.#getRouteData();
        this.#renderRoute();
      }
    }
  };

  #filterTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      if (evt.target.dataset.filterType !== this.#currentFilterType) {
        // Из ТЗ: при смене фильтра сортировка сбрасывается на Day
        this.#currentSortType = DEFAULT_SORT_TYPE;

        this.#currentFilterType = filterType[evt.target.dataset.filterType.toUpperCase()];
        this.#routeData = this.#getRouteData();
        this.#renderRoute({isResetSortType: true});
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

  #renderRoute({isResetSortType = false} = {}) {
    remove(this.#routeComponent);
    if (isResetSortType) {
      this.#sortPresenter.removeComponent();
      this.#sortPresenter = new SortPresenter(this.#routeData, this.routeContainer);
    }
    this.#pointMap.clear();

    if (this.#route.route && this.#route.route.length) {
      if (this.#routeData && this.#routeData.length) {
        this.#routeComponent = new RouteView();
        this.#routeData.forEach((item) => this.#renderPoint(item));

        document.querySelector('.trip-events__trip-sort').addEventListener('click', this.#sortTypeClickHandler);
        document.addEventListener('keydown', this.#escKeydownHandler);
      } else {
        this.#routeComponent = new EmptyRouteView(filterEmptyMessage[this.#currentFilterType.toUpperCase()]);
      }
    } else {
      this.#headerPresenter.removeComponent();
      this.#sortPresenter.removeComponent();
      this.#routeComponent = new EmptyRouteView();
    }
    render(this.#routeComponent, this.routeContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#route, this.#routeComponent, point, this.#resetRoutePoints);
    pointPresenter.init(point);
    this.#pointMap.set(point.id, pointPresenter);
  }

  #rerenderPoint(point) {
    const pointPresenter = this.#pointMap.get(point.id);
    pointPresenter.rerenderPoint(point);
  }
}
