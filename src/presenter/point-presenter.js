import RoutePointView from '../view/route-point-view.js';
import UpdatePointView from '../view/update-point-view.js';
import { ActionType } from '../utils/common.js';

import { render, replace, remove } from '../framework/render.js';

const DisplayMode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT'
};

export default class PointPresenter {
  #routePresenter = null;
  #routeModel = null;
  #routeComponent = null;
  #rowComponent = null;
  #updateComponent = null;
  #point = null;
  #mode = null;
  #actionType = null;

  constructor(routePresenter, routeModel, routeComponent, point, actionType) {
    this.#routePresenter = routePresenter;
    this.#routeModel = routeModel;
    this.#routeComponent = routeComponent;
    this.#point = point;
    this.#mode = DisplayMode.VIEW;
    this.#actionType = actionType;

    this.#rowComponent = new RoutePointView(this, this.#routePresenter, this.#point);
    this.#updateComponent = null;
  }

  init() {
    if (this.#actionType === ActionType.APPEND) {
      render(this.#rowComponent, this.#routeComponent.element, 'afterbegin');
      this.rowRolldownHandler();
    } else {
      render(this.#rowComponent, this.#routeComponent.element);
    }
  }

  rowRolldownHandler = () => {
    this.#updateComponent = new UpdatePointView(this, this.#routePresenter, this.#point, this.#actionType);
    replace(this.#updateComponent, this.#rowComponent);

    this.#mode = DisplayMode.EDIT;
  };

  resetComponent = () => {
    if (this.#mode === DisplayMode.EDIT) {
      this.#updateComponent.removeDatePickr();
      replace(this.#rowComponent, this.#updateComponent);
      this.#mode = DisplayMode.VIEW;
    }
  };

  removeComponent = () => {
    remove(this.#rowComponent);
  };


  toggleFavoriteHandler = async () => {
    const prevComponent = this.#rowComponent;
    const prevPoint = this.#point;

    this.#point = await this.#routeModel.toggleFavorite(this.#point);
    if (this.#point) {
      this.#rowComponent = new RoutePointView(this, this.#routePresenter, this.#point);
      replace(this.#rowComponent, prevComponent);
    } else {
      this.#point = prevPoint;
      this.#rowComponent = new RoutePointView(this, this.#routePresenter, this.#point);
      replace(this.#rowComponent, prevComponent);
      this.#rowComponent.shake();
    }
  };

  addPoint = (point) => {
    this.#routeModel.addPoint(point, this);
  };

  updatePoint = (point) => {
    this.#routeModel.updatePoint(point, this);
  };

  deletePoint = (point) => {
    this.#routeModel.deletePoint(point, this);
  };

  updateError = () => {
    this.#updateComponent.shake();
    this.#updateComponent.setSaveButtonText();
  };

  deleteError = () => {
    this.#updateComponent.shake();
    this.#updateComponent.setDeleteButtonText();
  };
}
