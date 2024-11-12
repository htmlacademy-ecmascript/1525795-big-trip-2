import RouteView from '../view/route-view.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';
import LoadingView from '../view/loading-view.js';

import { filterEmptyMessage, ActionType } from '../utils/common.js';

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
  #filterPresenter = null;
  #actionType = null;

  #loadingComponent = new LoadingView();

  constructor({routeContainer, headerContainer, filterModel, routeModel, sortModel, sortPresenter, headerPresenter, filterPresenter}) {
    this.headerContainer = headerContainer;
    this.routeContainer = routeContainer;

    this.#filterModel = filterModel;
    this.#routeModel = routeModel;
    this.#sortModel = sortModel;
    this.#headerPresenter = headerPresenter;
    this.#sortPresenter = sortPresenter;
    this.#filterPresenter = filterPresenter;

    this.#filterModel.addObserver(this.#eventHandler);
    this.#sortModel.addObserver(this.#eventHandler);
    this.#routeModel.addObserver(this.#eventHandler);

    this.#routeComponent = null;
  }

  init = (isPrepareData = false) => {
    if (isPrepareData) {
      this.#routeComponent = this.#loadingComponent;
      render(this.#routeComponent, this.routeContainer);
      return;
    }

    this.#eventHandler();
  };

  #eventHandler = () => {
    // Получаем отфильтрованные и отсортированные данные
    this.#routeData = this.#routeModel.getRouteData(this.#filterModel.currentFilter, this.#sortModel.currentSortType);

    // ... и отрисовываем маршрут
    this.#renderRoute();
  };

  // Для всех точек маршрута восстанавливаем исходный вид (превращаем в строку)
  #resetRoutePoints = () => this.#pointMap.forEach((item) => item.resetComponent());

  #addNewEventHandler = () => {
    // Сначала сбрасываем к исходному виду все открытые формы
    this.#resetRoutePoints();

    // Сбрасываем фильтрацию в значение по-умолчанию (по ТЗ), сортировка сбросится в значение по-умолчанию вместе с фильтром
    this.#filterPresenter.resetFilterType();
    this.#renderRoute();

    // Если до сих пор отображалось Click New Event...
    if (this.#routeComponent instanceof EmptyRouteView) {
      // Удаляем компонент пустого маршрута
      remove(this.#routeComponent);
      // Создаем новый компонент
      this.#routeComponent = new RouteView();
    }

    render(this.#routeComponent, this.routeContainer);
    // Рендерим форму добавления для пустой точки маршрута
    this.#renderPoint(this.#routeModel.getEmptyPoint());
  };

  #renderRoute = () => {
    remove(this.#routeComponent);
    this.#pointMap.clear();

    if (this.#routeModel.route && this.#routeModel.route.length) {
      // Если в модели есть точки маршрута
      if (this.#routeData && this.#routeData.length) {
        // Если в отфильтрованных данных есть точки маршрута, то рендерим их
        this.#routeComponent = new RouteView();
        this.#routeData.forEach((item) => this.#renderPoint(item));
      } else {
        // В отфильтрованных данных нет точек, показываем сообщение, что для текущего фильтра нет данных
        this.#routeComponent = new EmptyRouteView(filterEmptyMessage[this.#filterModel.currentFilter.toUpperCase()]);
      }
    } else {
      // В модели нет данных, рендерим пустую страницу
      this.#headerPresenter.removeComponent();
      this.#routeComponent = new EmptyRouteView();
    }
    this.#headerPresenter.refreshHeader();
    this.#filterPresenter.refreshFilter();
    this.#sortPresenter.refreshSort();
    render(this.#routeComponent, this.routeContainer);
    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#addNewEventHandler);
  };

  #renderPoint(point) {
    this.#actionType = point.id === 0 ? ActionType.APPEND : ActionType.EDIT;
    const pointPresenter = new PointPresenter(this.#routeModel, this.#routeComponent, point, this.#resetRoutePoints, this.#actionType, this.#renderRoute);
    pointPresenter.init(point);
    // Если добавление новой точки маршрута, то в Map запишется ключ с id = 0
    this.#pointMap.set(point.id, pointPresenter);
  }
}
