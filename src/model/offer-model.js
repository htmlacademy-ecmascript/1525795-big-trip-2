export default class OfferModel {
  #offers = [];
  #routeApiService = null;

  constructor(routeApiService) {
    this.#routeApiService = routeApiService;
  }

  async init() {
    this.#offers = await this.#routeApiService.offers;
  }

  get offers() {
    return this.#offers;
  }

  getOfferById(id) {
    for (let i = 0; i < this.#offers.length; i++) {
      for (let j = 0; j < this.#offers[i].offers.length; j++) {
        if (this.#offers[i].offers[j].id === id) {
          return this.#offers[i].offers[j];
        }
      }
    }

    return null;
  }
}
