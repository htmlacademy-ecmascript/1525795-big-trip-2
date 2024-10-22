import RoutePointView from '../view/row-point-view.js';
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
  updateFavoriteCb = null;
  resetMethodCb = null;

  constructor(routeComponent, point, updateFavoriteCb, resetMethodCb) {
    this.#routeComponent = routeComponent;
    this.#point = point;
    this.updateFavoriteCb = updateFavoriteCb;
    this.resetMethodCb = resetMethodCb;
    this.#mode = Mode.VIEW;

    // Два компонента
    // Строка с точкой маршрута
    this.#rowComponent = new RoutePointView(this.#point);

    // ... и форма редактирования точки маршрута
    this.#updateComponent = new UpdatePointView(this.#point, this.#formRollupClickHandler, this.#submitClickHandler);
  }

  #addListeners() {
    this.#rowComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rowRollupClickHandler);
    this.#rowComponent.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  init() {
    // Отрисовываем строку с точкой маршрута
    render(this.#rowComponent, this.#routeComponent.element);

    // Добавляем listeners для строки с точкой маршрута - реакция на favorite и раскрытие для редактирования
    this.#addListeners();
  }

  #favoriteClickHandler = () => {
    const prevComponent = this.#rowComponent;
    this.updateFavoriteCb(this.#point);
    this.#rowComponent = new RoutePointView(this.#point);
    replace(this.#rowComponent, prevComponent);
    this.#addListeners();
  };

  #submitClickHandler = () => {
    this.#point = this.#updateComponent._state;
    this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);

    const prevComponent = this.#rowComponent;
    this.#rowComponent = new RoutePointView(this.#point);
    replace(this.#rowComponent, prevComponent);
    this.#addListeners();

    // TODO: в случае изменения стоимости необходимо обновить заголовок

    this.#mode = Mode.VIEW;
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
