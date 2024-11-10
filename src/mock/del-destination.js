import { getRandomArrayItem } from '../util.js';


export const destinations = [
  {
    'id': '1',
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'https://i.pinimg.com/736x/e8/8f/30/e88f3028afe762960b7a2c11837b34d1.jpg',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://i.pinimg.com/736x/9f/b3/d3/9fb3d303905046143b259f42e33c7844.jpg',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': '2',
    'description': 'Amsterdam, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Amsterdam',
    'pictures': [
      {
        'src': 'https://i.pinimg.com/736x/ae/2e/70/ae2e70f6660753cf4353ff443d3b1726.jpg',
        'description': 'Amsterdam parliament building'
      },
      {
        'src': 'https://i.pinimg.com/736x/50/cc/c0/50ccc0381cb2bfefea04deff34a45fd6.jpg',
        'description': 'Amsterdam parliament building'
      }

    ]
  },
  {
    'id': '3',
    'description': 'Geneva, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Geneva',
    'pictures': [
      {
        'src': 'https://i.pinimg.com/736x/6f/7e/93/6f7e931d4eaa4d12f228b1c239cb3f4d.jpg',
        'description': 'Geneva parliament building'
      },
      {
        'src': 'https://i.pinimg.com/736x/f1/cd/c8/f1cdc81502b76727db094ca604c0486c.jpg',
        'description': 'Geneva parliament building'
      }
    ]
  },
  {
    'id': '4',
    'description': 'Paris, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Paris',
    'pictures': [
    ]
  }
];


export const getRandomDestination = () => getRandomArrayItem(destinations).id;


export const getDestinationById = (id) =>
  destinations[destinations.findIndex((item) => item.id === id)];


export const getDestinationByName = (name) =>
  destinations[destinations.findIndex((item) => item.name.toLowerCase() === name.toLowerCase())];
