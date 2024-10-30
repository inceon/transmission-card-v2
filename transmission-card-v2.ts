// Move this declaration outside any modules and before any code
export {};

declare global {
  interface Window {
    customCards: any[];
  }
}

class TransmissionCardV2 extends HTMLElement {
  private content: HTMLElement | null = null;
  private config!: any;

  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Example-card">
          <div class="card-content"></div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    this.content.innerHTML = `
      The state of ${entityId} is ${stateStr}!
      <br><br>
      <img src="http://via.placeholder.com/350x150">
    `;
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns in masonry view
  getCardSize() {
    return 3;
  }

  // The rules for sizing your card in the grid in sections view
  getLayoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 2,
      grid_min_rows: 3,
      grid_max_rows: 3,
    };
  }

  // Add type definition at the top of the class
  static getConfigElement() {
    return document.createElement("transmission-card-v2-editor");
  }

  // Add proper type definition
  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }
}

// Update the element registration
window.customElements.define("transmission-card-v2", TransmissionCardV2);

// Add this at the end of the file
window.customCards = window.customCards || [];
window.customCards.push({
  type: "transmission-card-v2",
  name: "Transmission Card V2",
  description: "A custom card for Transmission"
});
