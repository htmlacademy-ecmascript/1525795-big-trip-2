import RoutePresenter from './presenter/route-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import RouteModel from './model/route-model.js';
import RouteApi from './route-api.js';

import DestinationModel from './model/destination-model.js';
import OfferModel from './model/offer-model.js';

const ENDPOINT = 'https://22.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic abcdefghijklmno';

export const routeApi = new RouteApi(ENDPOINT, AUTHORIZATION);
const routeModel = new RouteModel(routeApi);

export const destinationModel = new DestinationModel(routeApi);
export const offerModel = new OfferModel(routeApi);


const routeContainer = document.querySelector('.trip-events');
const sortModel = new SortModel();
const sortPresenter = new SortPresenter(routeModel, routeContainer, sortModel);

const headerContainer = document.querySelector('.trip-controls__filters');
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(headerContainer, filterModel, sortPresenter, routeModel);

// headerPresenter необходимо передать в routePresenter, так как своей модели у headerPresenter'а нет, он
// только меняет и отображает свое состояние в зависимости от действий пользователя в других компонентах
const headerPresenter = new HeaderPresenter(routeModel);

const routePresenter = new RoutePresenter({
  routeContainer, headerContainer, filterModel, routeModel, sortModel, sortPresenter, headerPresenter, filterPresenter
});

filterPresenter.init();
sortPresenter.init();
let isPrepareData = true;
routePresenter.init(isPrepareData);

destinationModel.init()
  .then(() => offerModel.init())
  .then(() => routeModel.init())
  .then(() => {
    isPrepareData = false;
    routePresenter.init(isPrepareData);
  });
