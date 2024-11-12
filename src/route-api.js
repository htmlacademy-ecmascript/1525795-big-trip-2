import ApiService from './framework/api-service.js';

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export default class RouteApi extends ApiService {
  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  async addPoint(point) {
    try {
      const response = await this._load({
        url: 'points',
        method: HttpMethod.POST,
        body: JSON.stringify(point),
        headers: new Headers({'Content-Type': 'application/json'})});

      if (response.ok) {
        return await ApiService.parseResponse(response);
      } else {
        throw new Error('Can\'t add point', response);
      }
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }
}
