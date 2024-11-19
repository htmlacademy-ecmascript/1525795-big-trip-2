import RoutePointView from '../view/row-point-view.js';
import UpdatePointView from '../view/update-point-view.js';
import { ActionType, StateType } from '../utils/common.js';

import { render, replace, remove } from '../framework/render.js';

const Mode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT'
};

export default class PointPresenter {
  #routePresenter = null;
  #routeModel = null;
  #routeComponent = null;
  #rowComponent = null; // ??????? зачем передавать параметром?????
  #updateComponent = null;
  #point = null;
  #mode = null;
  #actionType = null;

  constructor(routePresenter, routeModel, routeComponent, point, actionType) {
    this.#routePresenter = routePresenter;
    this.#routeModel = routeModel;
    this.#routeComponent = routeComponent;
    this.#point = point;
    this.#mode = Mode.VIEW;
    this.#actionType = actionType;

    // Два компонента
    // Строка с точкой маршрута
    this.#rowComponent = new RoutePointView(this.#routePresenter, this.#routeModel, this.#point);

    // ... и форма редактирования точки маршрута
    this.#updateComponent = null;
  }

  init() {
    if (this.#actionType === ActionType.APPEND) {
      // Отрисовываем строку с новой точкой маршрута первой строкой в маршруте
      render(this.#rowComponent, this.#routeComponent.element, 'afterbegin');

      // И сразу преобразуем строку в форму редактирования
      this.rowRolldownHandler();
    } else {
      // Обычная точка маршрута - рендерим следующей строкой в конце списка
      render(this.#rowComponent, this.#routeComponent.element);
    }
  }


  // Развертывание строки в форму редактирования
  rowRolldownHandler = () => {
    this.#updateComponent = new UpdatePointView(this.#routePresenter, this.#routeModel, this.#point, this.#actionType);
    replace(this.#updateComponent, this.#rowComponent);

    this.#mode = Mode.EDIT;
  };

  resetComponent = () => {
    if (this.#mode === Mode.EDIT) {
      this.#updateComponent.removeDatePickr();
      replace(this.#rowComponent, this.#updateComponent);
      this.#mode = Mode.VIEW;
    }
  };

  removeComponent = () => {
    remove(this.#rowComponent);
  };
}
