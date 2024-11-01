import SortView from '../view/sort-view.js';

import { render, remove } from '../framework/render.js';


export default class SortPresenter {
  #sortComponent = null;
  #route = null;
  #container = null;

  constructor(route, container) {
    this.#route = route;
    this.#container = container;
    this.#sortComponent = new SortView(this.#route);

    render(this.#sortComponent, this.#container, 'afterbegin');
  }

  removeComponent = () => {
    remove(this.#sortComponent);
  };
}
