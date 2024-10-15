import RoutePointView from '../view/route-point-view.js';
import UpdatePointView from '../view/update-point-view.js';

import { render, replace } from '../framework/render.js';


export default class PointPresenter {
  #routeComponent = null;
  #rowComponent = null;
  #updateComponent = null;
  #point = null;
  updatePointCb = null;
  renderSortCb = null;

  constructor(routeComponent, point, updatePointCb, renderSortCb) {
    this.#routeComponent = routeComponent;
    this.#point = point;
    this.updatePointCb = updatePointCb;
    this.renderSortCb = renderSortCb;

    // Два компонента
    // Строка с точкой маршрута
    this.#rowComponent = new RoutePointView(this.#point);

    // ... и форма редактирования точки маршрута
    this.#updateComponent = new UpdatePointView(this.#point);
  }

  #addListeners() {
    this.#rowComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rowRollupClickHandler);
    this.#rowComponent.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  init() {
    // Отрисовываем строку с точкой маршрута
    render(this.#rowComponent, this.#routeComponent.element);

    // Добавляем listener для вызова формы редактирования строки
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
    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#updateComponent.element.querySelector('.event--edit').removeEventListener('submit', this.#formSubmitHandler);

    // Здесь будет обработка submit
  }

  // Это callback, который будет срабатывать на Esc в форме редактирования
  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);
      document.removeEventListener('keydown', this.#escKeydownHandler);
      this.#updateComponent.element.querySelector('.event--edit').removeEventListener('submit', this.#formSubmitHandler);
      this.#rowComponent.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
    }
  };

  // Это callback, который будет срабатывать при свертывании формы редактирования обратно в строку
  #formRollupClickHandler = () => {
    this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);

    this.#updateComponent.element.querySelector('.event__rollup-btn').removeEventListener('click', this.#formRollupClickHandler);
    this.#updateComponent.element.querySelector('.event__type-group').removeEventListener('change', this.#eventTypeChangeHandler);
    this.#rowComponent.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);

    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#updateComponent.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  // Это callback, который будет срабатывать при развертывании строки в форму редактирования
  #rowRollupClickHandler = () => {
    this.#rowComponent.replaceRowToForm(this.#updateComponent, this.#rowComponent);
    this.#rowComponent.element.querySelector('.event__favorite-btn').removeEventListener('click', this.#favoriteClickHandler);

    this.#updateComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formRollupClickHandler);
    this.#updateComponent.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.#updateComponent.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);

    document.addEventListener('keydown', this.#escKeydownHandler);
  };
}
