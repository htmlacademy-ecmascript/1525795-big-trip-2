import RoutePresenter from './presenter/route-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import RouteModel from './model/route-model.js';


const routeModel = new RouteModel();
const filterContainer = document.querySelector('.trip-controls__filters');
const divRoute = document.querySelector('.trip-events');
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filterContainer, filterModel);
const sortContainer = document.querySelector('.trip-events');
const sortModel = new SortModel();
const sortPresenter = new SortPresenter(sortContainer, sortModel);
const routePresenter = new RoutePresenter({routeContainer: divRoute, headerContainer: filterContainer, filterModel, routeModel, sortModel});


filterPresenter.init();
sortPresenter.init();
routePresenter.init();
