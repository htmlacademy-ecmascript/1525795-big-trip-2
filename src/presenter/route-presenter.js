import RouteView from '../view/route-view.js';
import RoutePointView from '../view/route-point-view.js';
import RouteModel from '../model/route-model.js';
import SortView from '../view/sort-view.js';
import UpdatePointView from '../view/update-point-view.js';
import EmptyRouteView from '../view/empty-route.js';
import TripInfoView from '../view/trip-info-view.js';

import { sortArray } from '../view/sort-view.js';
import { getTripTitle, getTripDates, getTripCost } from '../utils/common.js';

import { render, remove } from '../framework/render.js';


export default class RoutePresenter {
  // routeComponent - это место на странице (<ul></ul>), куда будут вставляться точки маршрута
  #routeComponent = new RouteView();
  // route - это исходные сгенерированные/полученные с сервера данные для отображения
  #route = new RouteModel();
  #sortComponent = new SortView(this.#route);
  #updateComponent = null;
  #emptyRoute = new EmptyRouteView();
  #tripInfoComponent = null;

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  #updateTripInfo() {
    if (this.#route.length > 0) {
      const tripTitle = getTripTitle(this.#route);
      const tripDates = getTripDates(this.#route);
      const tripCost = getTripCost(this.#route);

      const divTripMain = document.querySelector('.trip-main');
      this.#tripInfoComponent = new TripInfoView(tripTitle, tripDates, tripCost);
      render(this.#tripInfoComponent, divTripMain, 'afterbegin');
    }
  }

  #renderSort() {
    render(this.#sortComponent, this.routeContainer, 'afterbegin');
    let defaultSortMethod = '';

    sortArray.forEach(({sortName, isDisabled, isChecked, sortMethod}) => {
      if (!isDisabled) {
        this.#sortComponent.element.querySelector(`#sort-${sortName.toLowerCase()}`).addEventListener('click', () => {
          this.#sortComponent.element.querySelector(`#sort-${sortName.toLowerCase()}`).checked = true;
          this.#route.sort(sortMethod);
          this.#renderRoutePoints();
        });
      }

      if (isChecked) {
        defaultSortMethod = sortMethod;
      }
    });

    // Сортируем точки маршрута по-умолчанию
    this.#route = this.#route.route.sort(defaultSortMethod);
  }

  #renderEmptyRoute() {
    render(this.#emptyRoute, this.routeContainer);
  }

  init() {
    // Добавляем на страницу компонент маршрута
    render(this.#routeComponent, this.routeContainer);

    if (this.#route.route.length) {
      // ... и туда же компонент сортировки точек маршрута
      this.#renderSort();

      // Отрисовываем точки маршрута
      this.#renderRoutePoints();

      // Обновляем информацию о маршруте в заголовке страницы
      this.#updateTripInfo();
    } else {
      // ... либо Click New Event to create your first point
      this.#renderEmptyRoute();
    }
  }

  #renderRoutePoints() {
    // Пока не придумал, как очистить компонент при изменении сортировки, поэтому удаляю его и создаю заново
    remove(this.#routeComponent);
    this.#routeComponent = new RouteView();
    render(this.#routeComponent, this.routeContainer);

    for (let i = 0; i < this.#route.length; i++) {
      this.#renderPoint(this.#route[i]);
    }
  }

  #renderPoint(point) {
    // Два компонента
    // Строка с точкой маршрута
    const routePoint = new RoutePointView(point);
    // ... и форма редактирования точки маршрута
    const updateComponent = new UpdatePointView(point);

    // Отрисовываем строки с точками маршрута
    render(routePoint, this.#routeComponent.element);

    const eventTypeChangeHandler = () => {
      // Здесь будет обработка смены типа точки
    };

    // Это callback, который будет срабатывать на submit формы редактирования
    function formSubmitHandler(evt) {
      evt.preventDefault();
      updateComponent.replaceFormToRow(routePoint, updateComponent);
      document.removeEventListener('keydown', escKeydownHandler);
      updateComponent.element.querySelector('.event--edit').removeEventListener('submit', formSubmitHandler);

      // Здесь будет обработка submit
    }

    // Это callback, который будет срабатывать на Esc в форме редактирования
    function escKeydownHandler(evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        updateComponent.replaceFormToRow(routePoint, updateComponent);
        document.removeEventListener('keydown', escKeydownHandler);
        updateComponent.element.querySelector('.event--edit').removeEventListener('submit', formSubmitHandler);
      }
    }

    // Это callback, который будет срабатывать при свертывании формы редактирования обратно в строку
    const formRollupClickHandler = () => {
      updateComponent.replaceFormToRow(routePoint, updateComponent);

      updateComponent.element.querySelector('.event__rollup-btn').removeEventListener('click', formRollupClickHandler);
      updateComponent.element.querySelector('.event__type-group').removeEventListener('change', eventTypeChangeHandler);

      document.removeEventListener('keydown', escKeydownHandler);
      updateComponent.element.querySelector('.event--edit').addEventListener('submit', formSubmitHandler);
    };

    // Это callback, который будет срабатывать при развертывании строки в форму редактирования
    const rowRollupClickHandler = () => {
      routePoint.replaceRowToForm(updateComponent, routePoint);

      updateComponent.element.querySelector('.event__rollup-btn').addEventListener('click', formRollupClickHandler);
      updateComponent.element.querySelector('.event--edit').addEventListener('submit', formSubmitHandler);
      updateComponent.element.querySelector('.event__type-group').addEventListener('change', eventTypeChangeHandler);

      document.addEventListener('keydown', escKeydownHandler);
    };

    // На каждую строку маршрута - listener для вызова формы редактирования строки
    routePoint.element.querySelector('.event__rollup-btn').addEventListener('click', rowRollupClickHandler);
  }
}
