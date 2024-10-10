import AbstractView from '../framework/view/abstract-view.js';
import RouteView from '../view/route-view.js';
import RoutePointView from '../view/route-point-view.js';
import RouteModel from '../model/route-model.js';
import UpdatePointView from '../view/update-point-view.js';
import { render } from '../framework/render.js';


export default class RoutePresenter extends AbstractView {
  routeComponent = new RouteView();
  route = new RouteModel();
  routePoints = this.route.getRoute();

  constructor({routeContainer}) {
    super();
    this.routeContainer = routeContainer;
  }

  init() {
    render(this.routeComponent, this.routeContainer);
    render(new UpdatePointView(), this.routeComponent.element);

    const routeLength = this.routePoints.length;
    for (let i = 0; i < routeLength; i++) {
      render(new RoutePointView(this.routePoints[i]), this.routeComponent.element);
    }
  }
}
