import { getRandomPointType, getPointTypeById } from './point-type.js';
import { getRandomDestination } from './destination.js';
import { getRandomOffers } from './offer.js';
import { getRandomInteger } from '../util.js';
// import DestinationModel from '../model/destination-model.js';


const getFormattedTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.0Z`;
};


export const getRandomPoint = () => {
  const pointType = getRandomPointType();
  const pointTypeObj = getPointTypeById(pointType);
  const randomOffers = getRandomOffers(pointTypeObj);

  const startDay = getRandomInteger(1, 15); // Стартуем с 1 половины месяца
  const startTime = getRandomInteger(0, 1440);
  const formattedStartTime = getFormattedTime(startTime);
  const endDay = startDay + getRandomInteger(0, 7);
  const endTime = getRandomInteger(startTime, 1440);
  const formattedEndTime = getFormattedTime(endTime);

  const generatedPoint = {
    'id': getRandomInteger(1, 100000), // Вместо UUID
    'base_price': getRandomInteger(1, 1000),
    'date_from': `2024-11-${String(startDay).padStart(2, '0')}T${formattedStartTime}`,
    'date_to': `2024-11-${String(endDay).padStart(2, '0')}T${formattedEndTime}`,
    'destination': getRandomDestination(),
    // 'destination': destinations.getRandomDestination(),
    'is_favorite': false,
    'offers': randomOffers,
    'type': pointTypeObj.name.toLowerCase()
  };

  return generatedPoint;
};
