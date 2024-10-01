import RouteView from '../view/route-view.js';
import RoutePointView from '../view/route-point-view.js';

import { render } from '../render.js';

const POINT_COUNT = 3;


export default class RoutePresenter {
  routeComponent = new RouteView();
  routePointComponent = new RoutePointView();

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  init() {
    render(this.routeComponent, this.routeContainer);

    for (let i = 0; i <= POINT_COUNT; i++) {
      render(new RoutePointView(), this.routeComponent.getElement());
    }
  }
}
