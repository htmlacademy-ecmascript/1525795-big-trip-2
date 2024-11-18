export default class DestinationModel {
  #destinations = [];
  #routeApiService = null;

  constructor(routeApiService) {
    this.#routeApiService = routeApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#routeApiService.destinations;
    } catch (err) {
      return false;
    }
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById = (id) =>
    this.#destinations[this.#destinations.findIndex((item) => item.id === id)];

  getDestinationByName = (name) =>
    this.#destinations[this.#destinations.findIndex((item) => item.name.toLowerCase() === name.toLowerCase())];
}
