import { getDestinationById } from '../mock/destination.js';
import { getFormattedRangeDate } from '../util.js';
import { getOfferById } from '../mock/offer.js';

import dayjs from 'dayjs';


const getEventLength = (dateFrom, dateTo) => {
  const startDateTime = new Date(dateFrom);
  const endDateTime = new Date(dateTo);

  return endDateTime - startDateTime;
};

const getEventStartDate = (dateFrom) => new Date(dateFrom);
export const sortByPrice = (a, b) => b.base_price - a.base_price;
export const sortByDate = (a, b) => getEventStartDate(a.date_from) - getEventStartDate(b.date_from);
export const sortByTime = (a, b) => getEventLength(b.date_from, b.date_to) - getEventLength(a.date_from, a.date_to);

export const sortTypes = ['day', 'event', 'time', 'price', 'offers'];
export const sortMethods = {
  day: sortByDate,
  time: sortByTime,
  price: sortByPrice
};
export const DEFAULT_SORT_TYPE = sortTypes[0];
export const DEFAULT_SORT_METHOD = sortMethods[DEFAULT_SORT_TYPE];

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);


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
  const startDate = dayjs(copyRoute[0].date_from);
  const endDate = dayjs(copyRoute.slice(-1)[0].date_to);

  return `${getFormattedRangeDate(startDate.date(), startDate.month() + 1, endDate.date(), endDate.month() + 1)}`;
};


export const getTripCost = (route) => {
  // Здесь подсчет стоимости маршрута. Суммируется стоимость каждой точки маршрута плюс стоимость offers  для точки маршрута
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
