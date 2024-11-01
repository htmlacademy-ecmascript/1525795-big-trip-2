import FilterView from '../view/filter-view.js';

import { render, remove } from '../framework/render.js';


export default class FilterPresenter {
  #filterComponent = null;
  #route = null;
  #container = null;

  constructor(route, container) {
    this.#route = route;
    this.#container = container;
    this.#filterComponent = new FilterView(this.#route);

    render(this.#filterComponent, this.#container, 'afterbegin');
  }

  removeComponent = () => {
    remove(this.#filterComponent);
  };
}
