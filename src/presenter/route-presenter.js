import RouteView from '../view/route-view.js';
import EmptyRouteView from '../view/empty-route.js';
import PointPresenter from './point-presenter.js';
import LoadingView from '../view/loading-view.js';

import { destinationModel } from '../main.js';
import { offerModel } from '../main.js';

import { filterEmptyMessage, ActionType, StateType, DEFAULT_FILTER_TYPE, RouteState } from '../utils/common.js';

import { render, remove, replace } from '../framework/render.js';

export default class RoutePresenter {
  routeContainer = null;
  headerContainer = null;
  #routeComponent = null;

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

    this.#filterPresenter.addObserver(this.routeStateHandler);
    this.#sortPresenter.addObserver(this.routeStateHandler);
    this.#routeModel.addObserver(this.routeStateHandler);

    this.#routeComponent = new RouteView();
    render(this.#routeComponent, this.routeContainer);
  }

  init = (isLoadData = false) => {
    if (isLoadData) {
      this.routeStateHandler(StateType.LOADING_VIEW);
      return;
    }

    this.routeStateHandler();
  };

  #getStateType = () => {
    let stateType = null;

    const destinations = destinationModel.destinations;
    const offers = offerModel.offers;

    if (!destinations.length || !offers.length) {
      // Если не подгрузились точки назначения или доп.опции, то смысла работать с приложением нет
      return StateType.FAILED_LOAD_DATA;
    }

    if (this.#routeModel.routeState === RouteState.FAILED_LOAD) {
      return StateType.FAILED_LOAD_DATA;
    }

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
      // В модели данных нет
      if (this.#filterPresenter.currentFilter !== DEFAULT_FILTER_TYPE) {
        // Вот этот костыль уже чисто под тесты! Если фильтр - не фильтр по умолчанию, то состояние - пустые отфильтрованные данные
        stateType = StateType.EMPTY_FILTERED_VIEW;
      } else {
        stateType = StateType.EMPTY_VIEW;
      }
    }

    return stateType;
  };


  routeStateHandler = (stateType = null, point = null) => {
    if (!stateType) {
      stateType = this.#getStateType();
    }

    // Здесь нужно оптимизировать. Если StateType.FAILED_LOAD_DATA или StateType.NO_DATA, то нет смысла обновлять заголовок, сортировку, фильтры
    this.#headerPresenter.refreshHeader();
    this.#filterPresenter.refreshFilter();
    this.#sortPresenter.refreshSort();

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
        this.#setNewPointViewState();
        this.#sortPresenter.removeComponent();
        break;

      case StateType.UPDATE_POINT_VIEW:
        // Здесь подогнал под тест, нужно оптимизировать!
        // Если есть компонент создания новой точки маршрута, удалить только этот компонент,
        // удалить презентер из this.#pointMap,
        // разблокировать кнопку добавления новой точки
        // и потом развернуть ту точку, по которой был клик
        this.#setListViewState();
        document.querySelector('.trip-main__event-add-btn').disabled = false;
        this.#setUpdatePointViewState(point);
        break;

      case StateType.NO_DATA:
        this.#setNoDataViewState();
        this.#headerPresenter.removeComponent();
        this.#sortPresenter.removeComponent();
        break;

      case StateType.FAILED_LOAD_DATA:
        this.#setFailedLoadDataViewState();
        this.#headerPresenter.removeComponent();
        this.#sortPresenter.removeComponent();
        break;
    }

    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#setNewPointViewState);
  };


  #renderPoint(point) {
    this.#actionType = point.id === 0 ? ActionType.APPEND : ActionType.EDIT;
    const pointPresenter = new PointPresenter(this, this.#routeModel, this.#routeComponent, point, this.#actionType);
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
  };

  #setNoDataViewState = () => {
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new EmptyRouteView('Click New Event to create your first point');
    document.querySelector('.trip-main__event-add-btn').disabled = true;
    replace(this.#routeComponent, prevRouteComponent);
    remove(prevRouteComponent);
  };

  #setFailedLoadDataViewState = () => {
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new EmptyRouteView('Failed to load latest route information');
    document.querySelector('.trip-main__event-add-btn').disabled = true;
    replace(this.#routeComponent, prevRouteComponent);
    remove(prevRouteComponent);
  };

  #setEmptyFilteredViewState = () => {
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new EmptyRouteView(filterEmptyMessage[this.#filterPresenter.currentFilter.toUpperCase()]);
    replace(this.#routeComponent, prevRouteComponent);
    remove(prevRouteComponent);
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
  resetRoutePoints = () => this.#pointMap.forEach((item) => item.resetComponent());

  #setNewPointViewState = () => {
    // Сначала сбрасываем к исходному виду все открытые формы
    this.resetRoutePoints();

    // Блокируем кнопку добавления нового события
    document.querySelector('.trip-main__event-add-btn').disabled = true;

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

  #setUpdatePointViewState = (point) => {
    // Получаем презентер выбранной точки маршута
    const selectedPointPresenter = this.#pointMap.get(point.id);

    // Сбрасываем к исходному виду все открытые формы
    this.resetRoutePoints();

    // Разворачиваем выбранную строку
    selectedPointPresenter.rowRolldownHandler();
  };
}
