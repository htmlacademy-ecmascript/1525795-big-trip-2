import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import RoutePresenter from './presenter/route-presenter.js';
import { sortByDate, sortByPrice, sortByTime } from './model/route-model.js';

import { render } from './render.js';

const divFilters = document.querySelector('.trip-controls__filters');
const divRoute = document.querySelector('.trip-events');
const routePresenter = new RoutePresenter({routeContainer: divRoute});


render(new FilterView(), divFilters);
render(new SortView(), divRoute);
routePresenter.init();


const dateSortInput = document.querySelector('#sort-day');
dateSortInput.addEventListener('click', sortByDate);

const timeSortInput = document.querySelector('#sort-time');
timeSortInput.addEventListener('click', sortByTime);

const priceSortInput = document.querySelector('#sort-price');
priceSortInput.addEventListener('click', sortByPrice);
