import AbstractView from '../framework/view/abstract-view.js';


function createRouteTemplate() {
  return `
    <ul class="trip-events__list">
    </ul>
  `;
}


export default class RouteView extends AbstractView {
  get template() {
    return createRouteTemplate();
  }
}
