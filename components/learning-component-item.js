class LearningComponentItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          @import "https://cdn.jsdelivr.net/npm/daisyui@2.14.0/dist/full.css";
        </style>
        <div class="card bg-base-200 shadow p-4">
          <label class="label">Title:</label>
          <input type="text" id="title" class="input input-bordered w-full mb-2" />
          <button id="remove" class="btn btn-error btn-sm">Remove</button>
        </div>
      `;
    }
  
    connectedCallback() {
      this.shadowRoot.querySelector('#remove').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('remove-learning-component', { bubbles: true, composed: true }));
      });
    }
  
    set data(value) {
      this.shadowRoot.querySelector('#title').value = value.title || '';
    }
  
    get data() {
      return {
        title: this.shadowRoot.querySelector('#title').value
      };
    }
  }
  
  customElements.define('learning-component-item', LearningComponentItem);  