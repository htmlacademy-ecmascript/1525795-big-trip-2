import RouteView from '../view/route-view.js';
import EmptyRouteView from '../view/empty-route-view.js';
import PointPresenter from './point-presenter.js';

import { destinationModel } from '../main.js';
import { offerModel } from '../main.js';
import NewEventView from '../view/new-event-view.js';

import { filterEmptyMessage, ActionType, StateType, StateTypeMessage, DEFAULT_FILTER_TYPE } from '../utils/common.js';

import { render, remove, replace } from '../framework/render.js';

const eventAddButton = new NewEventView();


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
      return StateType.FAILED_LOAD_DATA;
    }

    if (this.#routeModel.routeState === StateType.FAILED_LOAD) {
      return StateType.FAILED_LOAD_DATA;
    }

    this.#routeData = this.#routeModel.getRouteData(this.#filterPresenter.currentFilter, this.#sortPresenter.currentSortType);

    if (this.#routeModel.route && this.#routeModel.route.length) {
      stateType = StateType.LIST_VIEW;

      if (this.#routeData && this.#routeData.length) {
        stateType = StateType.LIST_VIEW;
      } else {
        stateType = StateType.EMPTY_FILTERED_VIEW;
      }
    } else {
      if (this.#filterPresenter.currentFilter !== DEFAULT_FILTER_TYPE) {
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
        this.#newPointClickHandler();
        this.#sortPresenter.removeComponent();
        break;

      case StateType.UPDATE_POINT_VIEW:
        this.#setListViewState();
        eventAddButton.enable();
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

    eventAddButton.element.addEventListener('click', this.#newPointClickHandler);
  };


  #renderPoint(point) {
    this.#actionType = point.id === 0 ? ActionType.APPEND : ActionType.EDIT;
    const pointPresenter = new PointPresenter(this, this.#routeModel, this.#routeComponent, point, this.#actionType);
    pointPresenter.init(point);
    this.#pointMap.set(point.id, pointPresenter);
  }

  #setLoadingViewState = () => {
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new EmptyRouteView(StateTypeMessage.LOADING);
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
    this.#routeComponent = new EmptyRouteView(StateTypeMessage.NO_DATA);
    eventAddButton.disable();
    replace(this.#routeComponent, prevRouteComponent);
    remove(prevRouteComponent);
  };

  #setFailedLoadDataViewState = () => {
    const prevRouteComponent = this.#routeComponent;
    this.#routeComponent = new EmptyRouteView(StateTypeMessage.FAILED_LOAD_DATA);
    eventAddButton.disable();
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


  resetRoutePoints = () => this.#pointMap.forEach((item) => item.resetComponent());

  #newPointClickHandler = () => {
    this.resetRoutePoints();
    eventAddButton.disable();
    this.#filterPresenter.resetFilterType();

    if (this.#routeComponent instanceof EmptyRouteView) {
      const prevRouteComponent = this.#routeComponent;
      this.#routeComponent = new RouteView();
      replace(this.#routeComponent, prevRouteComponent);
    }

    render(this.#routeComponent, this.routeContainer);
    this.#renderPoint(this.#routeModel.getEmptyPoint());
  };

  #setUpdatePointViewState = (point) => {
    const selectedPointPresenter = this.#pointMap.get(point.id);
    this.resetRoutePoints();
    selectedPointPresenter.rowRolldownHandler();
  };
}
