import TripInfoView from '../view/trip-info-view.js';
import { getTripTitle, getTripDates, getTripCost } from '../utils/common.js';

import { render } from '../framework/render.js';


export default class HeaderPresenter {
  #tripInfoComponent = null;
  #route = null;

  constructor(route) {
    this.#route = route;
  }

  init() {
    const divTripMain = document.querySelector('.trip-main');

    const tripTitle = getTripTitle(this.#route);
    const tripDates = getTripDates(this.#route);
    const tripCost = getTripCost(this.#route);

    this.#tripInfoComponent = new TripInfoView(tripTitle, tripDates, tripCost);
    render(this.#tripInfoComponent, divTripMain, 'afterbegin');
  }
}
// Сейчас этот компонент отрисовывается один раз при загрузке приложения
// Фактически он может меняться при изменении маршрута
// ToDo: Нужно добавить метод для изменения заголовка
