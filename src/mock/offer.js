import { getRandomInteger, getRandomArrayItem } from '../util.js';


export const offers = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': '1',
        'title': 'Upgrade to a business class',
        'price': 120
      },
      {
        'id': '2',
        'title': 'Order Uber',
        'price': 20
      }

    ]
  },
  {
    'type': 'sightseeing',
    'offers': [
      {
        'id': '3',
        'title': 'Book tickets',
        'price': 40
      },
      {
        'id': '4',
        'title': 'Lunch in city',
        'price': 30
      }
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': '5',
        'title': 'Add luggage',
        'price': 50
      },
      {
        'id': '6',
        'title': 'Switch to comfort',
        'price': 80
      },
      {
        'id': '7',
        'title': 'Add meal',
        'price': 15
      },
      {
        'id': '8',
        'title': 'Choose seats',
        'price': 5
      },
      {
        'id': '9',
        'title': 'Travel by train',
        'price': 40
      }
    ]
  }
];


export const getRandomOffers = (pointType) => {
  for (let i = 0; i < offers.length; i++) {
    if (offers[i].type.toLowerCase() === pointType.name.toLowerCase()) {
      const offersLength = Object.keys(offers[i].offers).length;
      const offersCount = getRandomInteger(0, offersLength);
      const offersArray = Array.from({length: offersCount}, () => getRandomArrayItem(offers[i].offers).id);
      const uniqueOffers = new Set(offersArray);

      return Array.from(uniqueOffers, (value) => value);
    }
  }

  return null;
};


export const getOfferById = (id) => {
  for (let i = 0; i < offers.length; i++) {
    for (let j = 0; j < offers[i].offers.length; j++) {
      if (offers[i].offers[j].id === id) {
        return offers[i].offers[j];
      }
    }
  }

  return null;
};
