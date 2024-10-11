const months = {
  1: 'JAN',
  2: 'FEB',
  3: 'MAR',
  4: 'APR',
  5: 'MAY',
  6: 'JUN',
  7: 'JUL',
  8: 'AUG',
  9: 'SEP',
  10: 'OCT',
  11: 'NOV',
  12: 'DEC',
};


export const filtersArray = [
  'Everything',
  'Future',
  'Present',
  'Past'
];


export const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};


export const getRandomArrayItem = (itemsArray) => {
  const item = Math.floor(Math.random() * itemsArray.length);

  return itemsArray[item];
};


export const getFormattedDate = (rawDate) => {
  const monthNum = +rawDate.split('-')[1];
  const day = rawDate.split('-')[2];

  return `${months[monthNum]} ${day}`;
};


export const getFormattedRangeDate = (startDay, startMonth, endDay, endMonth) => {
  if (startMonth === endMonth) {
    return `${String(startDay).padStart(2, '0')} - ${String(endDay).padStart(2, '0')}
            ${months[startMonth]}`;
  }

  return `${String(startDay).padStart(2, '0')} ${months[startMonth]} -
          ${String(endDay).padStart(2, '0')} ${months[endMonth]}`;
};
