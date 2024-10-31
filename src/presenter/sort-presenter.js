import SortView from '../view/sort-view.js';

import { render } from '../framework/render.js';


export default class SortPresenter {
  #sortComponent = null;
  #route = null;
  #container = null;

  constructor(route, container) {
    this.#route = route;
    this.#container = container;
    this.#sortComponent = new SortView(this.#route);
  }


  init() {
    render(this.#sortComponent, this.#container, 'afterbegin');
  }
}
