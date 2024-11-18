import HeaderView from '../view/header-view.js';

import { render, replace, remove } from '../framework/render.js';


export default class HeaderPresenter {
  #headerContainer = document.querySelector('.trip-main');
  #headerComponent = null;
  #routeModel = null;
  #tripTitle = null;
  #tripDates = null;
  #tripCost = null;

  constructor(routeModel) {
    this.#routeModel = routeModel;
    this.refreshHeader();
  }

  get headerComponent() {
    return this.#headerComponent;
  }

  #getTripData = () => {
    this.#tripTitle = this.#routeModel.getRouteTitle();
    this.#tripDates = this.#routeModel.getRouteDates();
    this.#tripCost = this.#routeModel.getRouteCost();
  };

  refreshHeader() {
    if (this.#routeModel.getRouteLength) {
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
  }

  removeComponent = () => {
    remove(this.#headerComponent);
    this.#headerComponent = null;
  };
}
