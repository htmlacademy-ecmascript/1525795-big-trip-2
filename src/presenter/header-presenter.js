import HeaderView from '../view/header-view.js';
import { getTripTitle, getTripDates, getTripCost } from '../utils/common.js';

import { render, replace } from '../framework/render.js';


export default class HeaderPresenter {
  #headerComponent = null;
  #route = null;
  #tripTitle = null;
  #tripDates = null;
  #tripCost = null;

  constructor(route) {
    this.#route = route;
  }

  init() {
    const divTripMain = document.querySelector('.trip-main');

    this.#getTripData();

    this.#headerComponent = new HeaderView(this.#tripTitle, this.#tripDates, this.#tripCost);
    render(this.#headerComponent, divTripMain, 'afterbegin');
  }

  #getTripData = () => {
    this.#tripTitle = getTripTitle(this.#route);
    this.#tripDates = getTripDates(this.#route);
    this.#tripCost = getTripCost(this.#route);
  };

  refreshHeader(updatedRoute) {
    this.#route = updatedRoute;
    this.#getTripData();
    const newHeaderComponent = new HeaderView(this.#tripTitle, this.#tripDates, this.#tripCost);
    replace(newHeaderComponent, this.#headerComponent);
    this.#headerComponent = newHeaderComponent;
  }
}
