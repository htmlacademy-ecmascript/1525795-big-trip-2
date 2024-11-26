export default class NewEventView {
  constructor() {
    this.newEventButton = document.querySelector('.trip-main__event-add-btn');
  }

  get element() {
    return this.newEventButton;
  }

  disable() {
    this.newEventButton.disabled = true;
  }

  enable() {
    this.newEventButton.disabled = false;
  }
}
