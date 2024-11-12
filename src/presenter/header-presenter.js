import HeaderView from '../view/header-view.js';

import { render, replace, remove } from '../framework/render.js';


export default class HeaderPresenter {
  #headerContainer = document.querySelector('.trip-main');
  #headerComponent = null;
  #route = null;
  #tripTitle = null;
  #tripDates = null;
  #tripCost = null;

  constructor(route) {
    this.#route = route;
    this.refreshHeader();
  }

  #getTripData = () => {
    this.#tripTitle = this.#route.getRouteTitle();
    this.#tripDates = this.#route.getRouteDates();
    this.#tripCost = this.#route.getRouteCost();
  };

  refreshHeader() {
    if (this.#route.route && this.#route.route.length) {
      const currentHeaderComponent = this.#headerComponent;
      this.#getTripData();
      this.#headerComponent = new HeaderView(this.#tripTitle, this.#tripDates, this.#tripCost);

      if (currentHeaderComponent === null) {
        render(this.#headerComponent, this.#headerContainer, 'afterbegin');
        return;
      }
      replace(this.#headerComponent, currentHeaderComponent);
      return;
    }
    this.removeComponent();
    this.#headerComponent = null;
  }

  removeComponent = () => {
    remove(this.#headerComponent);
    this.#headerComponent = null;
  };
}
