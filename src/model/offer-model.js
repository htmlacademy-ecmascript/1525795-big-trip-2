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

  getOfferById(pointType, id) {
    if (this.#offers) {
      const offerItem = this.#offers.find((item) => item.type === pointType);

      if (offerItem.offers) {
        for (const innerOffer of offerItem.offers) {
          if (innerOffer.id === id) {
            return innerOffer;
          }
        }
      }
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
