import FilterView from './view/filter-view.js';
import RoutePresenter from './presenter/route-presenter.js';

import { render } from './framework/render.js';

const divFilters = document.querySelector('.trip-controls__filters');
const divRoute = document.querySelector('.trip-events');
const routePresenter = new RoutePresenter({routeContainer: divRoute});


render(new FilterView(), divFilters);
routePresenter.init();
