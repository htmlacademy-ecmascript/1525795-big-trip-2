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

export const UpdateType = {
  HEADER: 'HEADER',
  ROW: 'ROW',
  ALL: 'ALL'
};


export const filterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};
export const DEFAULT_FILTER_TYPE = filterType.EVERYTHING;


export const filterEmptyMessage = {
  EVERYTHING: 'There are no everything events now',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now'
};
