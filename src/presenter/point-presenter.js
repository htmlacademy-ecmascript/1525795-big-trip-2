import RoutePointView from '../view/route-point-view.js';
import UpdatePointView from '../view/update-point-view.js';

import { render, replace } from '../framework/render.js';

const Mode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT'
};

export default class PointPresenter {
  #routeComponent = null;
  #rowComponent = null;
  #updateComponent = null;
  #point = null;
  #mode = null;
  updatePointCb = null;
  resetMethodCb = null;

  constructor(routeComponent, point, updatePointCb, resetMethodCb) {
    this.#routeComponent = routeComponent;
    this.#point = point;
    this.updatePointCb = updatePointCb;
    this.resetMethodCb = resetMethodCb;
    this.#mode = Mode.VIEW;

    // Два компонента
    // Строка с точкой маршрута
    this.#rowComponent = new RoutePointView(this.#point);

    // ... и форма редактирования точки маршрута
    this.#updateComponent = new UpdatePointView(this.#point, this.#rowComponent, this.#formRollupClickHandler);
  }

  #addListeners() {
    this.#rowComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rowRollupClickHandler);
    this.#rowComponent.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  init() {
    // Отрисовываем строку с точкой маршрута
    render(this.#rowComponent, this.#routeComponent.element);

    // Добавляем listeners
    this.#addListeners();
  }

  #favoriteClickHandler = () => {
    const prevComponent = this.#rowComponent;
    this.updatePointCb(this.#point);
    this.#rowComponent = new RoutePointView(this.#point);
    replace(this.#rowComponent, prevComponent);
    this.#addListeners();
  };


  // Это callback, который будет срабатывать при развертывании строки в форму редактирования
  #rowRollupClickHandler = () => {
    // Сначала сбрасываем к исходному виду все открытые формы
    this.resetMethodCb();
    // Затем на текущей точке меняем отображение
    this.#rowComponent.replaceRowToForm(this.#updateComponent, this.#rowComponent);
    this.#mode = Mode.EDIT;
  };

  // Это callback, который будет срабатывать при свертывании формы редактирования обратно в строку
  #formRollupClickHandler = () => {
    this.resetComponent();
  };

  resetComponent = () => {
    if (this.#mode === Mode.EDIT) {
      this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);
      this.#mode = Mode.VIEW;
    }
  };
}
