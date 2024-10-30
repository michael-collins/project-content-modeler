let contentModel = {};  // Holds the dynamically generated JSON structure
let config = {};  // Holds the structure and controls from config.json

// Load configuration JSON
async function loadConfig() {
  try {
    const response = await fetch('config.json');
    config = await response.json();
    initializeContentModel();
    renderContent();
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
}

// Initialize content model based on the configuration
function initializeContentModel() {
  contentModel = createDefaultStructure(config);
}

// Create default structure based on config
function createDefaultStructure(schema) {
  if (Array.isArray(schema)) {
    return schema.map(item => createDefaultStructure(item));
  }
  
  if (typeof schema === 'object') {
    const obj = {};
    for (const key in schema) {
      if (key === 'addEnabled' || key === 'removeEnabled') continue;
      obj[key] = createDefaultStructure(schema[key]);
    }
    return obj;
  }

  return null;  // Placeholder for default values if needed
}

// Generic add function
function addItem(parent, key) {
  const itemConfig = config[key];
  if (!itemConfig || !itemConfig.addEnabled) return;

  const newItem = createDefaultStructure(itemConfig);
  parent[key].push(newItem);
  renderContent();
}

// Generic remove function
function removeItem(parentArray, index, configKey) {
  const itemConfig = config[configKey];
  if (!itemConfig || !itemConfig.removeEnabled) return;

  parentArray.splice(index, 1);
  renderContent();
}

// Render the full content model
function renderContent() {
  const pathwaysContainer = document.getElementById('pathways');
  pathwaysContainer.innerHTML = ''; // Clear existing content

  contentModel.Pathway?.specializations?.forEach((pathway, index) => {
    pathwaysContainer.appendChild(renderPathway(pathway, index));
  });

  // Display JSON output for preview
  document.getElementById('output').innerHTML = `<pre>${JSON.stringify(contentModel, null, 2)}</pre>`;
}

// Render a pathway
function renderPathway(pathway, index) {
  const pathwayConfig = config.Pathway;
  const section = document.createElement('div');
  section.className = 'border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50';

<<<<<<< Updated upstream
  const removeButton = document.createElement('button');
  removeButton.className = 'float-right bg-red-500 text-white p-1 rounded-full hover:bg-red-600';
  removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 110-2h3V4zm2 3a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"/>
  </svg>`;
  removeButton.onclick = () => removeItem('pathway', pathway.id);
=======
  if (pathwayConfig.removeEnabled) {
    const removeButton = document.createElement('button');
    removeButton.className = 'float-right bg-red-500 text-white p-1 rounded-full hover:bg-red-600';
    removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 110-2h3V4zm2 3a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"/>
    </svg>`;
    removeButton.onclick = () => removeItem(contentModel.Pathway.specializations, index, 'Pathway');
    section.appendChild(removeButton);
  }
>>>>>>> Stashed changes

  const title = document.createElement('h2');
  title.className = 'text-lg font-semibold mb-2';
  title.textContent = 'Pathway';

  section.appendChild(title);
  section.appendChild(createInput('Title', pathway.title, 'text', { field: 'title', pathwayId: pathway.id }));
  section.appendChild(createInput('Description', pathway.description, 'text', { field: 'description', pathwayId: pathway.id }));

  const specializationContainer = document.createElement('div');
  specializationContainer.className = 'ml-4 mt-3 space-y-2';

<<<<<<< Updated upstream
  pathway.specializations.forEach(spec => {
    specializationContainer.appendChild(renderSpecialization(pathway.id, spec));
  });

  const addSpecializationButton = document.createElement('button');
  addSpecializationButton.className = 'w-full mt-2 bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-600';
  addSpecializationButton.textContent = 'Add Specialization';
  addSpecializationButton.onclick = () => addSpecialization(pathway.id);
=======
  pathway.specializations.forEach((spec, specIndex) => {
    specializationContainer.appendChild(renderSpecialization(pathway.id, spec, specIndex));
  });

  if (pathwayConfig.specializations[0].addEnabled) {
    const addSpecializationButton = document.createElement('button');
    addSpecializationButton.className = 'w-full mt-2 bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-600';
    addSpecializationButton.textContent = 'Add Specialization';
    addSpecializationButton.onclick = () => addItem(pathway, 'specializations');
    section.appendChild(addSpecializationButton);
  }
>>>>>>> Stashed changes

  section.appendChild(specializationContainer);
  section.appendChild(addSpecializationButton);
  return section;
}

// Render a specialization
function renderSpecialization(pathwayId, spec, index) {
  const specConfig = config.Pathway.specializations[0];
  const section = document.createElement('div');
  section.className = 'border border-gray-300 rounded-lg p-4 mb-2 bg-white';

<<<<<<< Updated upstream
  const removeButton = document.createElement('button');
  removeButton.className = 'float-right bg-red-500 text-white p-1 rounded-full hover:bg-red-600';
  removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 110-2h3V4zm2 3a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"/>
  </svg>`;
  removeButton.onclick = () => removeItem('specialization', pathwayId, spec.id);
=======
  if (specConfig.removeEnabled) {
    const removeButton = document.createElement('button');
    removeButton.className = 'float-right bg-red-500 text-white p-1 rounded-full hover:bg-red-600';
    removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 110-2h3V4zm2 3a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"/>
    </svg>`;
    removeButton.onclick = () => removeItem(contentModel.Pathway.specializations, index, 'Specialization');
    section.appendChild(removeButton);
  }
>>>>>>> Stashed changes

  const title = document.createElement('h3');
  title.className = 'text-md font-semibold mb-1';
  title.textContent = 'Specialization';

  section.appendChild(title);
  section.appendChild(createInput('Title', spec.title, 'text', { field: 'title', pathwayId, specId: spec.id }));
  section.appendChild(createInput('Description', spec.description, 'text', { field: 'description', pathwayId, specId: spec.id }));

  return section;
}

<<<<<<< Updated upstream
// Updated removeItem function to handle deletion of items by type
function removeItem(type, pathwayId, specId = null) {
  if (type === 'pathway') {
    contentModel.pathways = contentModel.pathways.filter(p => p.id !== pathwayId);
  } else if (type === 'specialization') {
    const pathway = contentModel.pathways.find(p => p.id === pathwayId);
    if (pathway) {
      pathway.specializations = pathway.specializations.filter(s => s.id !== specId);
    }
  }
  renderContent();  // Re-render content to update the display
}

// Update JSON and directly update model on input change
=======
// Create an input field dynamically
>>>>>>> Stashed changes
function createInput(label, value = '', type = 'text', dataset = {}) {
  const container = document.createElement('div');
  container.className = 'mb-2';

  const labelEl = document.createElement('label');
  labelEl.className = 'block font-medium';
  labelEl.textContent = label;
  container.appendChild(labelEl);

  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.className = 'w-full border border-gray-300 rounded px-3 py-1 mt-1';
  Object.keys(dataset).forEach(key => {
    input.dataset[key] = dataset[key];
  });

  input.addEventListener('input', (event) => updateModel(event));
  container.appendChild(input);

  return container;
}

// Update content model dynamically
function updateModel(event) {
  const { field, pathwayId, specId } = event.target.dataset;
  const value = event.target.value;

  const pathway = contentModel.Pathway.specializations.find(p => p.id == pathwayId);
  if (!pathway) return;

  if (specId) {
    const spec = pathway.specializations.find(s => s.id == specId);
    if (!spec) return;
    spec[field] = value;
  } else {
    pathway[field] = value;
  }

  // Update JSON preview
  document.getElementById('output').innerHTML = `<pre>${JSON.stringify(contentModel, null, 2)}</pre>`;
}

// Load configuration when the page is ready
window.addEventListener('DOMContentLoaded', loadConfig);
