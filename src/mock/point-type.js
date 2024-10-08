import { getRandomArrayItem } from '../util.js';


export const pointTypes = [
  {
    'id': '1',
    'name': 'Taxi'
  },
  {
    'id': '2',
    'name': 'Bus'
  },
  {
    'id': '3',
    'name': 'Train'
  },
  {
    'id': '4',
    'name': 'Ship'
  },
  {
    'id': '5',
    'name': 'Drive'
  },
  {
    'id': '6',
    'name': 'Flight'
  },
  {
    'id': '7',
    'name': 'Check-in'
  },
  {
    'id': '8',
    'name': 'Sightseeing'
  },
  {
    'id': '9',
    'name': 'Restaurant'
  }
];

export const getRandomPointType = () => getRandomArrayItem(pointTypes).id;


export const getPointTypeById = (id) =>
  pointTypes[pointTypes.findIndex((item) => item.id === id)];


export const getPointTypeByName = (name) =>
  pointTypes[pointTypes.findIndex((item) => item.name.toLowerCase() === name.toLowerCase())];
