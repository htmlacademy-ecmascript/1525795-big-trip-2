import RoutePresenter from './presenter/route-presenter.js';


const divFilters = document.querySelector('.trip-controls__filters');
const divRoute = document.querySelector('.trip-events');
const routePresenter = new RoutePresenter({routeContainer: divRoute, headerContainer: divFilters});


routePresenter.init();
