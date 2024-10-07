import { getRandomArrayItem } from '../util.js';


export const pointTypes = [
  {
    'id': '10',
    'name': 'Taxi'
  },
  {
    'id': '20',
    'name': 'Bus'
  },
  {
    'id': '30',
    'name': 'Train'
  },
  {
    'id': '40',
    'name': 'Ship'
  },
  {
    'id': '50',
    'name': 'Drive'
  },
  {
    'id': '60',
    'name': 'Flight'
  },
  {
    'id': '70',
    'name': 'Check-in'
  },
  {
    'id': '80',
    'name': 'Sightseeing'
  },
  {
    'id': '90',
    'name': 'Restaurant'
  }
];

export const getRandomPointType = () => getRandomArrayItem(pointTypes).id;

export const getPointTypeById = (id) => {
  for (let i = 0; i < pointTypes.length; i++) {
    if (pointTypes[i].id === id) {
      return pointTypes[i];
    }
  }

  return null;
};

export const getPointTypeByName = (name) => {
  for (let i = 0; i < pointTypes.length; i++) {
    if (pointTypes[i].name.toLowerCase() === name.toLowerCase()) {
      return pointTypes[i];
    }
  }

  return null;
};
