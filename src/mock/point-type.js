import { getRandomArrayItem } from '../util.js';


export const pointTypes = {
  0: 'Taxi',
  1: 'Bus',
  2: 'Train',
  3: 'Ship',
  4: 'Drive',
  5: 'Flight',
  6: 'Check-in',
  7: 'Sightseeing',
  8: 'Restaurant'
};

export const getRandomPointType = () => getRandomArrayItem(pointTypes);
