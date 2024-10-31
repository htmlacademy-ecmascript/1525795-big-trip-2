import HeaderView from '../view/header-view.js';

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
    this.#tripTitle = this.#route.getRouteTitle();
    this.#tripDates = this.#route.getRouteDates();
    this.#tripCost = this.#route.getRouteCost();
  };

  refreshHeader() {
    this.#getTripData();
    const newHeaderComponent = new HeaderView(this.#tripTitle, this.#tripDates, this.#tripCost);
    replace(newHeaderComponent, this.#headerComponent);
    this.#headerComponent = newHeaderComponent;
  }
}
