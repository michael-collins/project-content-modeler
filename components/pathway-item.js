class PathwayItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          @import "https://cdn.jsdelivr.net/npm/daisyui@2.14.0/dist/full.css";
        </style>
        <div class="card bg-base-100 shadow-md p-4">
          <h3 class="text-lg font-semibold mb-2">Pathway</h3>
          <label class="label">Title:</label>
          <input type="text" id="title" class="input input-bordered w-full mb-2" />
          <label class="label">Description:</label>
          <input type="text" id="description" class="input input-bordered w-full mb-4" />
          
          <!-- Add Specialization Button with Plus Icon -->
          <button id="add-specialization" class="btn btn-outline btn-primary btn-sm flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Specialization
          </button>
  
          <!-- Remove Pathway Button with Trash Icon -->
          <button id="remove-pathway" class="btn btn-error btn-sm flex items-center gap-1 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-7 7-7-7" />
            </svg>
            Remove Pathway
          </button>
          
          <div id="specializations" class="mt-3"></div>
        </div>
      `;
    }
  }
  
  
    connectedCallback() {
      this.shadowRoot.querySelector('#add-specialization').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('add-specialization', { bubbles: true, composed: true }));
      });
    }
  
    set data(value) {
      this.shadowRoot.querySelector('#title').value = value.title || '';
      this.shadowRoot.querySelector('#description').value = value.description || '';
    }
  
    get data() {
      return {
        title: this.shadowRoot.querySelector('#title').value,
        description: this.shadowRoot.querySelector('#description').value
      };
    }
  }
  
  customElements.define('pathway-item', PathwayItem);
  