import { getRandomArrayItem } from '../util.js';


export const destinations = [
  {
    'id': '1',
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': '2',
    'description': '',
    'name': 'Amsterdam',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': '3',
    'description': '',
    'name': 'Geneva',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': '4',
    'description': '',
    'name': 'Paris',
    'pictures': [
    ]
  }
];


export const getRandomDestination = () => getRandomArrayItem(destinations).id;


export const getDestinationById = (id) => {
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i].id === id) {
      return destinations[i];
    }
  }

  return null;
};


export const getDestinationByName = (name) => {
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i].name.toLowerCase() === name.toLowerCase()) {
      return destinations[i];
    }
  }

  return null;
};
