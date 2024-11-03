import RouteView from '../view/route-view.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';

import { UpdateType, filterEmptyMessage } from '../utils/common.js';

import { render, remove } from '../framework/render.js';


export default class RoutePresenter {
  routeContainer = null;
  headerContainer = null;
  #routeComponent = null;
  #filterModel = null;
  #sortModel = null;
  #routeModel = null;
  #routeData = null;
  #pointMap = new Map();
  #headerPresenter = null;
  #sortPresenter = null;

  constructor({routeContainer, headerContainer, filterModel, routeModel, sortModel, sortPresenter, headerPresenter}) {
    this.headerContainer = headerContainer;
    this.routeContainer = routeContainer;

    this.#filterModel = filterModel;
    this.#routeModel = routeModel;
    this.#sortModel = sortModel;
    this.#headerPresenter = headerPresenter;
    this.#sortPresenter = sortPresenter;

    this.#filterModel.addObserver(this.#handleRouteEvent);
    this.#routeModel.addObserver(this.#handleRouteEvent);
    this.#sortModel.addObserver(this.#handleRouteEvent);
  }

  init() {
    // Получаем отфильтрованные и отсортированные данные
    this.#routeData = this.#routeModel.getRouteData(this.#filterModel.currentFilter, this.#sortModel.currentSortType);

    // ... и отрисовываем маршрут
    this.#renderRoute();
  }

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
        // Снова запрашиваем список точек из модели
        this.#routeData = this.#routeModel.getRouteData(this.#filterModel.currentFilter, this.#sortModel.currentSortType);

        this.#headerPresenter.refreshHeader();
        this.#renderRoute();
        break;
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
    // if (isResetSortType) {

    // }
    this.#pointMap.clear();

    if (this.#routeModel.route && this.#routeModel.route.length) {
      if (this.#routeData && this.#routeData.length) {
        this.#routeComponent = new RouteView();
        this.#routeData.forEach((item) => this.#renderPoint(item));

        document.addEventListener('keydown', this.#escKeydownHandler);
      } else {
        this.#routeComponent = new EmptyRouteView(filterEmptyMessage[this.#filterModel.currentFilter.toUpperCase()]);
      }
    } else {
      this.#headerPresenter.removeComponent();
      this.#routeComponent = new EmptyRouteView();
    }
    this.#sortPresenter.init();
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
