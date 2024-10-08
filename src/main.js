import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import RoutePresenter from './presenter/route-presenter.js';

import { render } from './render.js';

const divFilters = document.querySelector('.trip-controls__filters');
const divRoute = document.querySelector('.trip-events');
const routePresenter = new RoutePresenter({routeContainer: divRoute});


render(new FilterView(), divFilters);
render(new SortView(), divRoute);
routePresenter.init();
