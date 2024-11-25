export default class OfferModel {
  #offers = [];
  #routeApiService = null;

  constructor(routeApiService) {
    this.#routeApiService = routeApiService;
  }

  async init() {
    try {
      this.#offers = await this.#routeApiService.offers;
    } catch (err) {
      return false;
    }
  }

  get offers() {
    return this.#offers;
  }

  getOfferById(pointType, id) {
    if (!this.#offers || this.#offers.length === 0) {
      return null;
    }

    const offerItem = this.#offers.find((item) => item.type === pointType);

    if (offerItem.offers) {
      return offerItem.offers.find((item) => item.id === id);
    }

    return null;
  }

  getOffersByPointType(pointType) {
    if (this.#offers) {
      const offerItem = this.#offers.find((item) => item.type === pointType);

      return offerItem.offers;
    }

    return null;
  }
}
