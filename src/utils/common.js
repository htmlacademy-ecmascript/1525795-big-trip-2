const getEventLength = (dateFrom, dateTo) => {
  const startDateTime = new Date(dateFrom);
  const endDateTime = new Date(dateTo);

  return endDateTime - startDateTime;
};

const getEventStartDate = (dateFrom) => new Date(dateFrom);
export const sortByPrice = (a, b) => b.basePrice - a.basePrice;
export const sortByDate = (a, b) => getEventStartDate(a.dateFrom) - getEventStartDate(b.dateFrom);
export const sortByTime = (a, b) => getEventLength(b.dateFrom, b.dateTo) - getEventLength(a.dateFrom, a.dateTo);

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
