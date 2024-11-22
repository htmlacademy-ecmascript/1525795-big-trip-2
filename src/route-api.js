import ApiService from './framework/api-service.js';

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export default class RouteApi extends ApiService {
  get points() {
    try {
      return this._load({url: 'points'}).then(ApiService.parseResponse);
    } catch (err) {
      return [];
    }
  }

  get destinations() {
    try {
      return this._load({url: 'destinations'}).then(ApiService.parseResponse);
    } catch (err) {
      return [];
    }
  }

  get offers() {
    try {
      return this._load({url: 'offers'}).then(ApiService.parseResponse);
    } catch (err) {
      return [];
    }
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'}),});

    return await ApiService.parseResponse(response);
  }


  async updatePoint(point) {
    let response = await this._load({
      url: `points/${point.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'})
    });
    response = await ApiService.parseResponse(response);
    return response;
  }

  async deletePoint(pointId) {
    await this._load({
      method: HttpMethod.DELETE,
      url: `points/${pointId}`
    });
  }
}
