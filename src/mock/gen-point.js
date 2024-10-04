import { getRandomPointType } from './point-type.js';
import { getRandomDestination } from './destination.js';
import { getRandomOptionsArray } from './option-type.js';
import { getRandomInteger } from '../util.js';


export const getRandomPoint = () => {
  const genPoint = {
    pointType: getRandomPointType(),
    destination: getRandomDestination(),
    startDateTime: '2024-01-01T00:00',
    endDateTime: '2024-12-31T23:59',
    price: getRandomInteger(0, 100), // Здесь пока не понятно, к чему относится это свойство - к точке маршрута или к стоимости доставки до точки маршрута
    options: getRandomOptionsArray()
  };

  return genPoint;
};
