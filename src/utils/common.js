import { getDestinationById } from '../mock/destination.js';
import { getFormattedRangeDate } from '../util.js';
import { getOfferById } from '../mock/offer.js';

const getEventLength = (dateFrom, dateTo) => {
  const startDateTime = new Date(dateFrom);
  const endDateTime = new Date(dateTo);

  return endDateTime - startDateTime;
};

const getEventStartDate = (dateFrom) => new Date(dateFrom);
export const sortByPrice = (a, b) => b.base_price - a.base_price;
export const sortByDate = (a, b) => getEventStartDate(a.date_from) - getEventStartDate(b.date_from);
export const sortByTime = (a, b) => getEventLength(b.date_from, b.date_to) - getEventLength(a.date_from, a.date_to);

export const sortMap = new Map([
  ['Day', {
    sortName: 'Day',
    isDisabled: false,
    isChecked: true,
    sortMethod: sortByDate
  }],
  ['Event', {
    sortName: 'Event',
    isDisabled: true,
    isChecked: false,
    sortMethod: null
  }],
  ['Time', {
    sortName: 'Time',
    isDisabled: false,
    isChecked: false,
    sortMethod: sortByTime
  }],
  ['Price', {
    sortName: 'Price',
    isDisabled: false,
    isChecked: false,
    sortMethod: sortByPrice
  }],
  ['Offers', {
    sortName: 'Offers',
    isDisabled: true,
    isChecked: false,
    sortMethod: null
  }]
]);
export const defaultSortName = 'Day';


export const getTripTitle = (route) => {
  const pointsList = new Array();
  route.forEach((item) => pointsList.push(getDestinationById(item.destination).name));

  if (pointsList.length > 3) {
    return `${[pointsList[0]]} - ... - ${[pointsList[pointsList.length - 1]]}`;
  }

  return pointsList.join(' - ');
};


export const getTripDates = (route) => {
  const copyRoute = route.slice().sort(sortByDate);
  const startDate = new Date(copyRoute[0].date_from);
  const endDate = new Date(copyRoute.slice(-1)[0].date_to);

  return `${getFormattedRangeDate(startDate.getUTCDate(), startDate.getUTCMonth() + 1, endDate.getUTCDate(), endDate.getUTCMonth() + 1)}`;
};


export const getTripCost = (route) => {
  let cost = 0;
  for (let i = 0; i < route.length; i++) {
    cost += route[i].base_price;

    if (route[i].offers && route[i].offers.length) {
      for (let j = 0; j < route[i].offers.length; j++) {
        cost += getOfferById(route[i].offers[j]).price;
      }
    }
  }

  return cost;
};
