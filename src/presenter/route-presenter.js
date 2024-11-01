import RouteView from '../view/route-view.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';
import SortPresenter from './sort-presenter.js';
import HeaderPresenter from './header-presenter.js';

import { DEFAULT_SORT_TYPE, FilterType, sortMethods, UpdateType, filterEmptyMessage } from '../utils/common.js';

import { render, remove } from '../framework/render.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';


export default class RoutePresenter {
  routeContainer = null;
  headerContainer = null;
  #routeComponent = null;
  #filterModel = null;
  #routeModel = null;
  #routeData = null;
  #pointMap = new Map();
  #headerPresenter = null;
  #sortPresenter = null;
  // #currentFilterType = FilterType.EVERYTHING;
  #currentSortType = DEFAULT_SORT_TYPE;

  constructor({routeContainer, headerContainer, filterModel, routeModel}) {
    this.headerContainer = headerContainer;
    this.routeContainer = routeContainer;

    this.#filterModel = filterModel;
    this.#routeModel = routeModel;
    this.#headerPresenter = new HeaderPresenter(this.#routeModel);
    this.#sortPresenter = new SortPresenter(this.#routeData, this.routeContainer);

    this.#filterModel.addObserver(this.#handleRouteEvent);
    this.#routeModel.addObserver(this.#handleRouteEvent);
  }

  init() {
    // Получаем отфильтрованные и отсортированные данные
    // this.#routeData = this.#getRouteData();
    this.#routeData = this.#routeModel.getRouteData(this.#filterModel.currentFilter, this.#currentSortType);

    // ... и отрисовываем маршрут
    this.#renderRoute();
  }

  // #getRouteData = () => {
  //   // Получаем данные из модели
  //   let routeData = [...this.#routeModel.route];

  //   // Фильтруем
  //   switch (this.#filterModel.currentFilter) {
  //     case FilterType.EVERYTHING:
  //       break;
  //     case FilterType.FUTURE:
  //       routeData = routeData.filter((item) => dayjs(item.dateFrom) > dayjs());
  //       break;
  //     case FilterType.PRESENT:
  //       dayjs.extend(isBetween);
  //       routeData = routeData.filter((item) => dayjs().isBetween(item.dateFrom, item.dateTo));
  //       break;
  //     case FilterType.PAST:
  //       routeData = routeData.filter((item) => dayjs(item.dateTo) <= dayjs());
  //       break;
  //   }

  //   // Сортируем
  //   routeData.sort(sortMethods[this.#currentSortType]);

  //   return routeData;
  // };

  #handleRouteEvent = (updateType, point) => {
    // console.log('inside handleRouteEvent');
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
        // console.log('inside updateType.ALL', this.#filterModel.currentFilter);
        // Снова запрашиваем список точек из модели
        // this.#routeData = this.#getRouteData();
        this.#routeData = this.#routeModel.getRouteData(this.#filterModel.currentFilter, this.#currentSortType);

        this.#headerPresenter.refreshHeader();
        this.#renderRoute();
        break;
    }
  };

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      if (evt.target.dataset.sortType !== this.#currentSortType) {
        this.#currentSortType = evt.target.dataset.sortType;
        // this.#routeData = this.#getRouteData();
        this.#routeData = this.#routeModel.getRouteData(this.#filterModel.currentFilter, this.#currentSortType);
        this.#renderRoute();
      }
    }
  };

  // #filterTypeClickHandler = (evt) => {
  //   if (evt.target.tagName === 'INPUT') {
  //     if (evt.target.dataset.filterType !== this.#currentFilterType) {
  //       // Из ТЗ: при смене фильтра сортировка сбрасывается на Day
  //       this.#currentSortType = DEFAULT_SORT_TYPE;

  //       this.#currentFilterType = FilterType[evt.target.dataset.filterType.toUpperCase()];
  //       this.#routeData = this.#getRouteData();
  //       this.#renderRoute({isResetSortType: true});
  //     }
  //   }
  // };

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

    if (this.#routeModel.route && this.#routeModel.route.length) {
      if (this.#routeData && this.#routeData.length) {
        this.#routeComponent = new RouteView();
        this.#routeData.forEach((item) => this.#renderPoint(item));

        document.querySelector('.trip-events__trip-sort').addEventListener('click', this.#sortTypeClickHandler);
        document.addEventListener('keydown', this.#escKeydownHandler);
      } else {
        this.#routeComponent = new EmptyRouteView(filterEmptyMessage[this.#filterModel.currentFilter.toUpperCase()]);
      }
    } else {
      this.#headerPresenter.removeComponent();
      this.#sortPresenter.removeComponent();
      this.#routeComponent = new EmptyRouteView();
    }
    render(this.#routeComponent, this.routeContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#routeModel, this.#routeComponent, point, this.#resetRoutePoints);
    pointPresenter.init(point);
    this.#pointMap.set(point.id, pointPresenter);
  }

  #rerenderPoint(point) {
    const pointPresenter = this.#pointMap.get(point.id);
    pointPresenter.rerenderPoint(point);
  }
}
