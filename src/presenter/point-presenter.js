import RoutePointView from '../view/row-point-view.js';
import UpdatePointView from '../view/update-point-view.js';
import { UpdateType, ActionType } from '../utils/common.js';

import { render, replace, remove } from '../framework/render.js';

const Mode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT'
};

export default class PointPresenter {
  #route = null;
  #routeComponent = null;
  #rowComponent = null;
  #updateComponent = null;
  #point = null;
  #mode = null;
  #actionType = null;
  cbResetMethod = null;
  cbRefreshHeader = null;
  cbRefreshRoute = null;

  constructor(route, routeComponent, point, cbResetMethod, actionType, cbRefreshRoute) {
    this.#route = route;
    this.#routeComponent = routeComponent;
    this.#point = point;
    this.cbResetMethod = cbResetMethod;
    this.#mode = Mode.VIEW;
    this.#actionType = actionType;
    this.cbRefreshRoute = cbRefreshRoute;

    // Два компонента
    // Строка с точкой маршрута
    this.#rowComponent = new RoutePointView(this.#point);

    // ... и форма редактирования точки маршрута
    this.#updateComponent = null;
  }

  #addListeners() {
    this.#rowComponent.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rowRollupClickHandler);
    this.#rowComponent.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  init() {
    if (this.#actionType === ActionType.APPEND) {
      // Отрисовываем строку с новой точкой маршрута первой строкой в маршруте
      render(this.#rowComponent, this.#routeComponent.element, 'afterbegin');

      // И сразу преобразуем строку в форму редактирования
      this.#rowRollupClickHandler();
    } else {
      // Обычная точка маршрута - рендерим следующей строкой в конце списка
      render(this.#rowComponent, this.#routeComponent.element);

      // Добавляем listeners для строки с точкой маршрута - реакция на favorite и раскрытие для редактирования
      this.#addListeners();
    }
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      // Если добавление новой точки, то нужно удалить rowComponent у pointPresenter
      if (this.#actionType === ActionType.APPEND) {
        this.resetComponent();
        this.removeComponent();
      }
      this.resetComponent();
      this.cbRefreshRoute();
    }
  };

  #favoriteClickHandler = () => {
    this.#route.changeFavorite(UpdateType.POINT, this.#point);
    this.#addListeners();
  };

  #submitClickHandler = () => {
    this.#point = this.#updateComponent._state;

    if (this.#actionType === ActionType.APPEND) {
      this.#route.addPoint(UpdateType.ALL, this.#point);
    } else {
      this.#route.updatePoint(UpdateType.ALL, this.#point);
    }

    this.#updateComponent.replaceFormToRow(this.#rowComponent, this.#updateComponent);

    const prevComponent = this.#rowComponent;
    this.#rowComponent = new RoutePointView(this.#point);
    replace(this.#rowComponent, prevComponent);
    this.#updateComponent.removeDatePickr();
    this.#addListeners();

    this.#mode = Mode.VIEW;
  };

  #deletePointHandler = () => {
    this.#updateComponent.removeDatePickr();
    if (this.#actionType === ActionType.APPEND) {
      // Этот же метод выполняется при нажатии Cancel в форме добавления новой точки маршрута
      this.resetComponent();
      this.removeComponent();
      this.cbRefreshRoute();
    } else {
      this.#route.deletePoint(UpdateType.ALL, this.#point);
    }
  };

  rerenderPoint = (point) => {
    this.#point = point;
    const prevComponent = this.#rowComponent;
    this.#rowComponent = new RoutePointView(this.#point);
    replace(this.#rowComponent, prevComponent);
  };

  // Это callback, который будет срабатывать при развертывании строки в форму редактирования
  #rowRollupClickHandler = () => {
    // Сначала сбрасываем к исходному виду все открытые формы
    this.cbResetMethod();
    // Затем на текущей точке меняем отображение
    this.#updateComponent = new UpdatePointView(this.#point, this.#formRollupClickHandler, this.#submitClickHandler, this.#deletePointHandler, this.#actionType);
    replace(this.#updateComponent, this.#rowComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);

    this.#mode = Mode.EDIT;
  };

  // Это callback, который будет срабатывать при свертывании формы редактирования обратно в строку
  #formRollupClickHandler = () => {
    this.resetComponent();
    if (this.#actionType === ActionType.APPEND) {
      this.removeComponent();
      this.cbRefreshRoute();
    }
  };

  resetComponent = () => {
    if (this.#mode === Mode.EDIT) {
      this.#updateComponent.removeDatePickr();
      replace(this.#rowComponent, this.#updateComponent);
      document.removeEventListener('keydown', this.#escKeydownHandler);
      this.#mode = Mode.VIEW;
    }
  };

  removeComponent = () => {
    remove(this.#rowComponent);
  };
}
