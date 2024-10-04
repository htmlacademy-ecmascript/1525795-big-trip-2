import { getRandomInteger, getRandomArrayItem } from '../util.js';


export const optionTypes = {
  0: {
    name: 'Add luggage',
    price: 30
  },
  1: {
    name: 'Switch to comfort class',
    price: 100
  },
  2: {
    name: 'Add meal',
    price: 15
  },
  3: {
    name: 'Choose seats',
    price: 5
  },
  4: {
    name: 'Travel by train',
    price: 40
  }
};

export const getRandomOptionsArray = () => {
  const optionsLength = Object.keys(optionTypes).length;
  const optionsCount = getRandomInteger(0, optionsLength);
  const optionsArray = Array.from({length: optionsCount}, () => getRandomArrayItem(optionTypes));
  const uniqueOptions = new Set(optionsArray);

  return Array.from(uniqueOptions, (value) => value);
};
