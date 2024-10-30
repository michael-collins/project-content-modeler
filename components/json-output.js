class JsonOutput extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      const container = document.createElement('div');
      container.style.whiteSpace = 'pre-wrap';
      container.style.fontFamily = 'monospace';
      container.style.background = '#f0f0f0';
      container.style.padding = '10px';
      shadow.appendChild(container);
      this.container = container;
    }
  
    set data(value) {
      this.container.textContent = JSON.stringify(value, null, 2);
    }
  }
  
  customElements.define('json-output', JsonOutput);
  