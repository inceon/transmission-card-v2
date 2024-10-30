var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class TransmissionCardV2 extends HTMLElement {
    constructor() {
        super(...arguments);
        this.content = null;
        this.statusMessage = '';
    }
    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.
    set hass(hass) {
        // Initialize the content if it's not there yet.
        if (!this.content) {
            this.innerHTML = `
        <ha-card header="Transmission">
          <div class="card-content">
            <div class="input-group">
              <input type="text" placeholder="Enter torrent URL or magnet link" />
              <button>Add Torrent</button>
            </div>
            <div class="status-message"></div>
            <div class="torrent-info"></div>
          </div>
        </ha-card>
      `;
            this.content = this.querySelector(".torrent-info");
            this.inputField = this.querySelector("input");
            // Add button click handler
            const button = this.querySelector("button");
            button.addEventListener("click", () => this._addTorrent(hass));
        }
        // Update torrent info display
        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : "unavailable";
        this.content.innerHTML = `
      The state of ${entityId} is ${stateStr}!
    `;
        // Update status message if exists
        const statusEl = this.querySelector(".status-message");
        if (statusEl) {
            statusEl.innerHTML = this.statusMessage;
        }
    }
    _addTorrent(hass) {
        return __awaiter(this, void 0, void 0, function* () {
            const torrentUrl = this.inputField.value.trim();
            if (!torrentUrl) {
                this.statusMessage = '<div class="error">Please enter a torrent URL or magnet link</div>';
                this.requestUpdate();
                return;
            }
            try {
                yield hass.callService('transmission', 'add_torrent', {
                    entry_id: this.config.entry_id, // Make sure to add entry_id to card config
                    torrent: torrentUrl
                });
                this.statusMessage = '<div class="success">Torrent added successfully!</div>';
                this.inputField.value = ''; // Clear input field
            }
            catch (error) {
                this.statusMessage = `<div class="error">Error adding torrent: ${error.message}</div>`;
            }
            this.requestUpdate();
        });
    }
    // Helper method to trigger update
    requestUpdate() {
        this.hass = this.hass;
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
    connectedCallback() {
        // Add styles when element is connected to DOM
        const style = document.createElement('style');
        style.textContent = `
      .input-group {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }
      
      .input-group input {
        flex: 1;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
      }
      
      .input-group button {
        padding: 8px 16px;
        background-color: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .status-message {
        margin-bottom: 16px;
      }
      
      .error {
        color: var(--error-color);
      }
      
      .success {
        color: var(--success-color);
      }
    `;
        this.appendChild(style);
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
export {};
