let contentModel = {};  // Holds the dynamically generated JSON structure
let config = {};  // Holds the structure and controls from config.json

// Load configuration JSON
async function loadConfig() {
  try {
    const response = await fetch('config.json');
    config = await response.json();
    console.log("Loaded config:", config);  // Log the loaded config
    initializeContentModel();
    renderContent();
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
}

// Initialize content model based on the configuration
function initializeContentModel() {
  contentModel = createDefaultStructure(config);
  console.log("Initialized content model:", contentModel);  // Log the initialized content model
}

// Recursively create the default structure based on config
function createDefaultStructure(schema) {
  if (Array.isArray(schema)) {
    return [createDefaultStructure(schema[0])];
  }
  
  if (typeof schema === 'object') {
    const obj = {};
    for (const key in schema) {
      if (key === 'addEnabled' || key === 'removeEnabled') continue;
      obj[key] = createDefaultStructure(schema[key]);
    }
    return obj;
  }

  return '';  // Return an empty string for basic fields
}

// Generic add function using path to reach nested items
function addItem(parent, key, configSchema) {
  if (!configSchema || !configSchema.addEnabled) return;

  const newItem = createDefaultStructure(configSchema);
  
  if (!Array.isArray(parent[key])) {
    parent[key] = [];
  }
  parent[key].push(newItem);
  console.log(`Added item to ${key}:`, newItem);  // Log the addition of a new item
  renderContent();
}

// Generic remove function
function removeItem(parentArray, index) {
  const removedItem = parentArray.splice(index, 1);
  console.log("Removed item:", removedItem);  // Log the removal of an item
  renderContent();
}

// Render the full content model
function renderContent() {
  console.log("Rendering content model:", contentModel);  // Log the current content model
  const container = document.getElementById('pathways');
  container.innerHTML = '';  // Clear existing content
  container.appendChild(renderObject(contentModel, config));
  
  // Display JSON output for preview
  document.getElementById('output').innerHTML = `<pre>${JSON.stringify(contentModel, null, 2)}</pre>`;
}

// Recursive function to render an object or array based on config
function renderObject(obj, schema, path = []) {
  console.log("Rendering object:", obj, "with schema:", schema);  // Log object and schema at each recursion
  const container = document.createElement('div');
  container.className = 'ml-4 mt-3 space-y-2';

  for (const key in obj) {
    let fieldSchema = schema && schema[key];  // Check if schema exists for the key

    if (Array.isArray(fieldSchema)) {
      fieldSchema = fieldSchema[0];  // Use the first item as schema for array elements
    }

    // Skip rendering if fieldSchema is undefined
    if (!fieldSchema) {
      console.log(`Skipping ${key} as it has no schema.`);  // Log skipping undefined schema
      continue;
    }

    if (Array.isArray(obj[key])) {
      const arrayContainer = document.createElement('div');
      const title = document.createElement('h3');
      title.className = 'font-semibold mb-2';
      title.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}`;
      arrayContainer.appendChild(title);

      // Render items in the array
      obj[key].forEach((item, index) => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'border border-gray-300 rounded-lg p-4 mb-2 bg-white';

        // Add remove button for each item if allowed
        if (fieldSchema?.removeEnabled) {  // Safely access removeEnabled
          const removeButton = document.createElement('button');
          removeButton.className = 'float-right bg-red-500 text-white p-1 rounded-full hover:bg-red-600';
          removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 110-2h3V4zm2 3a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"/>
          </svg>`;
          removeButton.onclick = () => removeItem(obj[key], index);
          itemContainer.appendChild(removeButton);
        }

        // Recursively render nested object
        itemContainer.appendChild(renderObject(item, fieldSchema, [...path, key, index]));
        arrayContainer.appendChild(itemContainer);
      });

      // Add button for new items if allowed
      if (fieldSchema && fieldSchema.addEnabled) {  // Check that addEnabled is accessible
        const addButton = document.createElement('button');
        addButton.className = 'w-full mt-2 bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-600';
        addButton.textContent = `Add ${key.slice(0, -1)}`;  // Singular form
        addButton.onclick = () => addItem(obj, key, fieldSchema);
        arrayContainer.appendChild(addButton);
      }

      container.appendChild(arrayContainer);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Render nested objects
      const nestedContainer = renderObject(obj[key], fieldSchema, [...path, key]);
      const title = document.createElement('h3');
      title.className = 'font-semibold mb-2';
      title.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}`;
      container.appendChild(title);
      container.appendChild(nestedContainer);
    } else {
      // Render input fields for basic fields
      const inputContainer = createInput(key, obj[key], value => {
        obj[key] = value;
        renderContent();
      });
      container.appendChild(inputContainer);
    }
  }

  return container;
}

// Helper to create input fields for primitive values
function createInput(label, value, onInputChange) {
  const container = document.createElement('div');
  container.className = 'mb-2';

  const labelEl = document.createElement('label');
  labelEl.className = 'block font-medium';
  labelEl.textContent = label.charAt(0).toUpperCase() + label.slice(1);
  container.appendChild(labelEl);

  const input = document.createElement('input');
  input.type = 'text';
  input.value = value || '';
  input.className = 'w-full border border-gray-300 rounded px-3 py-1 mt-1';

  // Update model on blur or Enter key
  input.addEventListener('blur', () => onInputChange(input.value));
  input.addEventListener('keypress', event => {
    if (event.key === 'Enter') onInputChange(input.value);
  });

  container.appendChild(input);

  return container;
}

// Clear content model and update display
function clearContent() {
  contentModel = createDefaultStructure(config); // Reset to default structure
  console.log("Cleared content model:", contentModel);  // Log the cleared content model
  renderContent(); // Update the display to show the cleared state
}

// Load configuration when the page is ready
window.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  
  // Add clear button functionality
  document.getElementById('clear-button').addEventListener('click', clearContent);
});
