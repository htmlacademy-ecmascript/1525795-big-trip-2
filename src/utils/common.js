import { getDestinationById } from '../mock/destination.js';
import { sortByDate } from '../view/sort-view.js';
import { getFormattedRangeDate } from '../util.js';
import { getOfferById } from '../mock/offer.js';


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
  // С вложенным reduce слишком не читаемое будет выражение
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
