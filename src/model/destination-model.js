export default class DestinationModel {
  #destinations = [];
  #routeApiService = null;

  constructor(routeApiService) {
    this.#routeApiService = routeApiService;
  }

  async init() {
    this.#destinations = await this.#routeApiService.destinations;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById = (id) =>
    this.#destinations[this.#destinations.findIndex((item) => item.id === id)];

  getDestinationByName = (name) =>
    this.#destinations[this.#destinations.findIndex((item) => item.name.toLowerCase() === name.toLowerCase())];
}
