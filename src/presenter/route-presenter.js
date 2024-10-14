import RouteView from '../view/route-view.js';
import RoutePointView from '../view/route-point-view.js';
import RouteModel from '../model/route-model.js';
import SortView from '../view/sort-view.js';
import UpdatePointView from '../view/update-point-view.js';

import { sortArray } from '../view/sort-view.js';
import { sortByPrice } from '../view/sort-view.js';
import { getTripTitle, getTripDates, getTripCost } from '../utils/common.js';

import { render, remove, replace } from '../framework/render.js';


export default class RoutePresenter {
  // routeComponent - это место на странице (<ul></ul>), куда будут вставляться точки маршрута
  #routeComponent = new RouteView();
  // route - это исходные сгенерированные/полученные с сервера данные для отображения
  #route = new RouteModel();
  #sortComponent = new SortView(this.#route);
  #updateComponent = null;

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  #updateTripInfo() {
    document.querySelector('.trip-info__title').textContent = getTripTitle(this.#route);
    document.querySelector('.trip-info__dates').textContent = getTripDates(this.#route);
    document.querySelector('.trip-info__cost-value').textContent = getTripCost(this.#route);
  }

  #renderSort() {
    render(this.#sortComponent, this.routeContainer, 'afterbegin');

    sortArray.forEach(({sortName, isDisabled, sortMethod}) => {
      if (!isDisabled) {
        this.#sortComponent.element.querySelector(`#sort-${sortName.toLowerCase()}`).addEventListener('click', () => {
          this.#sortComponent.element.querySelector(`#sort-${sortName.toLowerCase()}`).checked = true;
          this.#route.sort(sortMethod);
          this.#renderRoutePoints();
        });
      }
    });
  }


  init() {
    // Добавляем на страницу компонент маршрута
    render(this.#routeComponent, this.routeContainer);
    // ... и туда же компонент сортировки точек маршрута
    this.#renderSort();

    // Сортируем точки маршрута по-умолчанию по цене
    this.#route = this.#route.route.sort(sortByPrice);
    // Отрисовываем точки маршрута
    this.#renderRoutePoints();

    // Обновляем информацию о маршруте в заголовке страницы
    this.#updateTripInfo();
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

    routePoint.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replace(updateComponent, routePoint);
    });

    updateComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replace(routePoint, updateComponent);
    });

    // document.addEventListener('keydown', (evt) => {
    //   if (evt.key === 'Escape') {
    //     evt.preventDefault();
    //     replace(routePoint, updateComponent);
    //   }
    // });
  }
}
