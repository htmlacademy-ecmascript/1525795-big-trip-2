import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import RoutePresenter from './presenter/route-presenter.js';

import { render } from './framework/render.js';

const divTripMain = document.querySelector('.trip-main');
const divFilters = document.querySelector('.trip-controls__filters');
const divRoute = document.querySelector('.trip-events');
const routePresenter = new RoutePresenter({routeContainer: divRoute});


render(new TripInfoView(), divTripMain, 'afterbegin');
render(new FilterView(), divFilters);
render(new SortView(), divRoute);
routePresenter.init();
