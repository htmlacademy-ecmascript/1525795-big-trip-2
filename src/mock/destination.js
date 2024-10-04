import { getRandomArrayItem } from '../util.js';


export const destinations = {
  0: {
    name: 'Amsterdam',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
    photos: []
  },
  1: {
    name: 'Chamonix',
    description: 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    photos: []
  },
  2: {
    name: 'Geneva',
    description: 'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    photos: []
  }
};

export const getRandomDestination = () => getRandomArrayItem(destinations);
