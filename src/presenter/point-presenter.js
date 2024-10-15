import RoutePointView from '../view/route-point-view.js';
import UpdatePointView from '../view/update-point-view.js';

import { render } from '../framework/render.js';


export default class PointPresenter {
  #routeComponent = null;
  #rowComponent = null;
  #updateComponent = null;

  constructor(routeComponent, point) {
    this.#routeComponent = routeComponent;

    // Два компонента
    // Строка с точкой маршрута
    this.#rowComponent = new RoutePointView(point);

    // ... и форма редактирования точки маршрута
    this.#updateComponent = new UpdatePointView(point);
  }

  init() {
    // Отрисовываем строку с точкой маршрута
    render(this.#rowComponent, this.#routeComponent.element);

    // Добавляем listener для вызова формы редактирования строки
    this.#rowComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rowRollupClickHandler);
  }

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
    }
  };

  // Это callback, который будет срабатывать при свертывании формы редактирования обратно в строку
  #formRollupClickHandler = () => {
    this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);

    this.#updateComponent.element.querySelector('.event__rollup-btn').removeEventListener('click', this.#formRollupClickHandler);
    this.#updateComponent.element.querySelector('.event__type-group').removeEventListener('change', this.#eventTypeChangeHandler);

    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#updateComponent.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  // Это callback, который будет срабатывать при развертывании строки в форму редактирования
  #rowRollupClickHandler = () => {
    this.#rowComponent.replaceRowToForm(this.#updateComponent, this.#rowComponent);

    this.#updateComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formRollupClickHandler);
    this.#updateComponent.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.#updateComponent.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);

    document.addEventListener('keydown', this.#escKeydownHandler);
  };
}
