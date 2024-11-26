import UiBlocker from './framework/ui-blocker/ui-blocker.js';

import RoutePresenter from './presenter/route-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import RouteModel from './model/route-model.js';
import RouteApi from './route-api.js';

import DestinationModel from './model/destination-model.js';
import OfferModel from './model/offer-model.js';

import NewEventView from './view/new-event-view.js';

const ENDPOINT = 'https://22.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic asdffghijklmno';

export const routeApi = new RouteApi(ENDPOINT, AUTHORIZATION);
const routeModel = new RouteModel(routeApi);

export const destinationModel = new DestinationModel(routeApi);
export const offerModel = new OfferModel(routeApi);


const routeContainer = document.querySelector('.trip-events');
const sortPresenter = new SortPresenter(routeModel, routeContainer);

const headerContainer = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter(headerContainer, sortPresenter, routeModel);

// headerPresenter необходимо передать в routePresenter, так как своей модели у headerPresenter'а нет, он
// только меняет и отображает свое состояние в зависимости от действий пользователя в других компонентах
const headerPresenter = new HeaderPresenter(routeModel);

const routePresenter = new RoutePresenter({
  routeContainer, headerContainer, routeModel, sortPresenter, headerPresenter, filterPresenter
});

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const newEventButton = new NewEventView();

export const uiBlocker = new UiBlocker({
  lowerLimit: TimeLimit.LOWER_LIMIT,
  upperLimit: TimeLimit.UPPER_LIMIT
});

// uiBlocker.block();
// Блокируем кнопку добавления нового события
newEventButton.disable();


filterPresenter.init();
sortPresenter.init();
let isLoadData = true;
routePresenter.init(isLoadData);

destinationModel.init()
  .then(() => offerModel.init())
  .then(() => routeModel.init())
  .then(() => {
    // uiBlocker.unblock();

    newEventButton.enable();

    isLoadData = false;
    routePresenter.init(isLoadData);
  });
