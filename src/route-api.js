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
      let response = await this._load({
        url: 'points',
        method: HttpMethod.POST,
        body: JSON.stringify(point),
        headers: new Headers({'Content-Type': 'application/json'}),
      });

      response = await ApiService.parseResponse(response);
      return response;
    } catch(err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
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
