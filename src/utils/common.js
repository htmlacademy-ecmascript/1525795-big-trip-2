import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';


const getEventLength = (dateFrom, dateTo) => {
  const startDateTime = new Date(dateFrom);
  const endDateTime = new Date(dateTo);

  return endDateTime - startDateTime;
};

// const getEventStartDate = (dateFrom) => new Date(dateFrom);
const getEventStartDate = (dateFrom) => dayjs(dateFrom).utc();
export const sortByPrice = (a, b) => b.basePrice - a.basePrice;
export const sortByDate = (a, b) => getEventStartDate(a.dateFrom) - getEventStartDate(b.dateFrom);
export const sortByTime = (a, b) => getEventLength(b.dateFrom, b.dateTo) - getEventLength(a.dateFrom, a.dateTo);

export const SortTypes = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers'
};
export const SortMethods = {
  Day: sortByDate,
  Time: sortByTime,
  Price: sortByPrice
};
export const DEFAULT_SORT_TYPE = SortTypes.DAY;
export const DEFAULT_SORT_METHOD = SortMethods.Day;

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const UpdateType = {
  HEADER: 'HEADER',
  ROW: 'ROW',
  ALL: 'ALL',
};


export const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};
export const DEFAULT_FILTER_TYPE = FilterType.EVERYTHING;


export const filterEmptyMessage = {
  EVERYTHING: 'There are no everything events now',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now'
};

export const ActionType = {
  APPEND: 'append',
  EDIT: 'edit',
  DELETE: 'delete'
};

export const PointTypes = {
  TAXI: 'Taxi',
  BUS: 'Bus',
  TRAIN: 'Train',
  SHIP: 'Ship',
  DRIVE: 'Drive',
  FLIGHT: 'Flight',
  CHECKIN: 'Check-in',
  SIGHTSEENG: 'Sightseeing',
  RESTAURANT: 'Restaurant'
};

export const StateType = {
  LOADING_VIEW: 'Loading view',
  EMPTY_VIEW: 'Empty view',
  EMPTY_FILTERED_VIEW: 'Empty filtered view',
  LIST_VIEW: 'List view',
  NEW_POINT_VIEW: 'New point view',
  UPDATE_POINT_VIEW: 'Update point view',
  NO_DATA: 'No data'
};

export const EventType = {
  ADD_POINT: 'Add point',
  UPDATE_POINT: 'Update point',
  DELETE_POINT: 'Delete point',
  FAVORITE_POINT: 'Favorite point',
  ROW_ROLLUP: 'Row rollup'
};
