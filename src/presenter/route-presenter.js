import RouteView from '../view/route-view.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';
import LoadingView from '../view/loading-view.js';

import { filterEmptyMessage, ActionType, StateType, EventType } from '../utils/common.js';

import { render, remove, replace } from '../framework/render.js';


export default class RoutePresenter {
  routeContainer = null;
  headerContainer = null;
  #routeComponent = null;
  // #routeComponent = new RouteView();

  #routeModel = null;
  #routeData = null;
  #pointMap = new Map();
  #headerPresenter = null;
  #sortPresenter = null;
  #filterPresenter = null;
  #actionType = null;


  constructor({routeContainer, headerContainer, routeModel, sortPresenter, headerPresenter, filterPresenter}) {
    this.headerContainer = headerContainer;
    this.routeContainer = routeContainer;

    this.#routeModel = routeModel;
    this.#headerPresenter = headerPresenter;
    this.#sortPresenter = sortPresenter;
    this.#filterPresenter = filterPresenter;

    this.#filterPresenter.addObserver(this.#routeStateHandler);
    this.#sortPresenter.addObserver(this.#routeStateHandler);
    this.#routeModel.addObserver(this.#routeStateHandler);

    this.#routeComponent = new RouteView();
    render(this.#routeComponent, this.routeContainer);
  }

  init = (isLoadData = false) => {
    if (isLoadData) {
      this.#routeStateHandler(StateType.LOADING_VIEW);
      return;
    }

    this.#routeStateHandler();
  };

  #getStateType = () => {
    let stateType = null;
    // Сначала получаем отфильтрованные и отсортированные данные
    this.#routeData = this.#routeModel.getRouteData(this.#filterPresenter.currentFilter, this.#sortPresenter.currentSortType);

    // Затем исходя из данных определяем состояние
    if (this.#routeModel.route && this.#routeModel.route.length) {
      // Как минимум в модели есть точки маршрута
      stateType = StateType.LIST_VIEW;

      if (this.#routeData && this.#routeData.length) {
        // В отфильтрованных данных есть точки маршрута
        stateType = StateType.LIST_VIEW;
      } else {
        // В отфильтрованных данных пусто
        stateType = StateType.EMPTY_FILTERED_VIEW;
      }
    } else {
      stateType = StateType.EMPTY_VIEW;
    }

    return stateType;
  };


  #routeStateHandler = (stateType = null) => {
    if (!stateType) {
      stateType = this.#getStateType();
    }
    // eslint-disable-next-line no-console
    console.log(stateType);

    switch (stateType) {
      case StateType.LOADING_VIEW:
        this.#setLoadingViewState();
        break;

      case StateType.EMPTY_VIEW:
        this.#setEmptyViewState();
        break;

      case StateType.EMPTY_FILTERED_VIEW:
        this.#setEmptyFilteredViewState();
        break;

      case StateType.LIST_VIEW:
        this.#setListViewState();
        break;

      case StateType.NEW_POINT_VIEW:
        // this.#setNewPointViewState();
        break;

      case StateType.UPDATE_POINT_VIEW:
        break;
    }
    // this.#currentStateType = stateType;
    this.#headerPresenter.refreshHeader();
    this.#filterPresenter.refreshFilter();
    this.#sortPresenter.refreshSort();

    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#setNewPointViewState);
  };


  #pointEventHandler = (eventType) => {
    switch (eventType) {
      case EventType.ADD_POINT:
        this.#routeStateHandler(StateType.NEW_POINT_VIEW);
        break;

      case EventType.UPDATE_POINT:
        break;
      case EventType.DELETE_POINT:
        break;
      case EventType.FAVORITE_POINT:
        break;
      case EventType.ROW_ROLLUP:
        break;
    }
  };

  #renderPoint(point) {
    this.#actionType = point.id === 0 ? ActionType.APPEND : ActionType.EDIT;
    const pointPresenter = new PointPresenter(this.#routeModel, this.#routeComponent, point, this.#resetRoutePoints, this.#actionType, this.#routeStateHandler);
    pointPresenter.init(point);
    // Если добавление новой точки маршрута, то в Map запишется ключ с id = 0
    this.#pointMap.set(point.id, pointPresenter);
  }


  #setLoadingViewState = () => {
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new LoadingView();
    replace(this.#routeComponent, prevRouteComponent);
    remove(prevRouteComponent);
  };

  #setEmptyViewState = () => {
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new EmptyRouteView();
    replace(this.#routeComponent, prevRouteComponent);
    remove(prevRouteComponent);
    // document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#addNewEventHandler);
  };

  #setEmptyFilteredViewState = () => {
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new EmptyRouteView(filterEmptyMessage[this.#filterPresenter.currentFilter.toUpperCase()]);
    replace(this.#routeComponent, prevRouteComponent);
    remove(prevRouteComponent);
    // document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#addNewEventHandler);
  };

  #setListViewState = () => {
    this.#pointMap.clear();
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new RouteView();
    this.#routeData.forEach((item) => this.#renderPoint(item));
    replace(this.#routeComponent, prevRouteComponent);
    remove(prevRouteComponent);
  };


  // Для всех точек маршрута восстанавливаем исходный вид (превращаем в строку)
  #resetRoutePoints = () => this.#pointMap.forEach((item) => item.resetComponent());

  #setNewPointViewState = () => {
    // Сначала сбрасываем к исходному виду все открытые формы
    this.#resetRoutePoints();

    // Сбрасываем фильтрацию в значение по-умолчанию (по ТЗ), сортировка сбросится в значение по-умолчанию вместе с фильтром
    this.#filterPresenter.resetFilterType();

    // Если до сих пор отображалось Click New Event...
    if (this.#routeComponent instanceof EmptyRouteView) {
      // Заменяем компонент
      const prevRouteComponent = this.#routeComponent;
      this.#routeComponent = new RouteView();
      replace(this.#routeComponent, prevRouteComponent);
    }

    render(this.#routeComponent, this.routeContainer);
    // Рендерим форму добавления для пустой точки маршрута
    this.#renderPoint(this.#routeModel.getEmptyPoint());
  };
}
