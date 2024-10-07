import RouteView from '../view/route-view.js';
import RoutePointView from '../view/route-point-view.js';
import RouteModel from '../model/route-model.js';
import UpdatePointView from '../view/update-point-view.js';
import { render } from '../render.js';


export default class RoutePresenter {
  routeComponent = new RouteView();
  routePointComponent = new RoutePointView();
  route = new RouteModel();
  routePoints = this.route.getRoute();

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  init() {
    render(this.routeComponent, this.routeContainer);
    render(new UpdatePointView(), this.routeComponent.getElement());

    console.log('route', this.routePoints);
    const routeLength = this.routePoints.length;
    for (let i = 0; i < routeLength; i++) {
      render(new RoutePointView(this.routePoints[i]), this.routeComponent.getElement());
    }
  }
}
