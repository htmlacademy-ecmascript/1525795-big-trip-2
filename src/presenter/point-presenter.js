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
    this.#updateComponent = new UpdatePointView(this.#point);
  }

  #addListeners() {
    this.#rowComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rowRollupClickHandler);
    this.#rowComponent.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);

    this.#updateComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formRollupClickHandler);
    this.#updateComponent.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.#updateComponent.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);
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

  #eventTypeChangeHandler = () => {
    // Здесь будет обработка смены типа точки
  };

  // Это callback, который будет срабатывать на submit формы редактирования
  #formSubmitHandler(evt) {
    evt.preventDefault();
    this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);

    // Здесь будет обработка submit
  }

  // Это callback, который будет срабатывать при свертывании формы редактирования обратно в строку
  #formRollupClickHandler = () => {
    this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);
    this.#mode = Mode.VIEW;
  };

  // Это callback, который будет срабатывать при развертывании строки в форму редактирования
  #rowRollupClickHandler = () => {
    this.resetMethodCb();
    this.#rowComponent.replaceRowToForm(this.#updateComponent, this.#rowComponent);
    this.#mode = Mode.EDIT;
  };

  resetComponent = () => {
    if (this.#mode === Mode.EDIT) {
      this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);
      this.#mode = Mode.VIEW;
    }
  };
}
