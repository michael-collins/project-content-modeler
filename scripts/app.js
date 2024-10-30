let contentModel = { pathways: [] };

function addPathway() {
  const pathway = { id: Date.now(), title: '', description: '', specializations: [] };
  contentModel.pathways.push(pathway);
  renderContent();
}

function addSpecialization(pathwayId) {
  const pathway = contentModel.pathways.find(p => p.id === pathwayId);
  if (pathway) {
    pathway.specializations.push({ id: Date.now(), title: '', description: '', projects: [] });
    renderContent();
  }
}

function renderContent() {
  const pathwaysContainer = document.getElementById('pathways');
  pathwaysContainer.innerHTML = ''; // Clear existing content

  contentModel.pathways.forEach(pathway => {
    pathwaysContainer.appendChild(renderPathway(pathway));
  });

  // Display JSON output
  document.getElementById('output').innerHTML = `<pre>${JSON.stringify(contentModel, null, 2)}</pre>`;
}

function renderPathway(pathway) {
  const section = document.createElement('div');
  section.className = 'border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50';

  const removeButton = document.createElement('button');
  removeButton.className = 'float-right bg-red-500 text-white p-1 rounded-full hover:bg-red-600';
  removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 110-2h3V4zm2 3a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"/>
  </svg>`;
  removeButton.onclick = () => removeItem('pathway', pathway.id);

  const title = document.createElement('h2');
  title.className = 'text-lg font-semibold mb-2';
  title.textContent = 'Pathway';

  section.appendChild(removeButton);
  section.appendChild(title);
  section.appendChild(createInput('Title', pathway.title, 'text', { field: 'title', pathwayId: pathway.id }));
  section.appendChild(createInput('Description', pathway.description, 'text', { field: 'description', pathwayId: pathway.id }));

  const specializationContainer = document.createElement('div');
  specializationContainer.className = 'ml-4 mt-3 space-y-2';

  pathway.specializations.forEach(spec => {
    specializationContainer.appendChild(renderSpecialization(pathway.id, spec));
  });

  const addSpecializationButton = document.createElement('button');
  addSpecializationButton.className = 'w-full mt-2 bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-600';
  addSpecializationButton.textContent = 'Add Specialization';
  addSpecializationButton.onclick = () => addSpecialization(pathway.id);

  section.appendChild(specializationContainer);
  section.appendChild(addSpecializationButton);
  return section;
}

function renderSpecialization(pathwayId, spec) {
  const section = document.createElement('div');
  section.className = 'border border-gray-300 rounded-lg p-4 mb-2 bg-white';

  const removeButton = document.createElement('button');
  removeButton.className = 'float-right bg-red-500 text-white p-1 rounded-full hover:bg-red-600';
  removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M6 4a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 110-2h3V4zm2 3a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"/>
  </svg>`;
  removeButton.onclick = () => removeItem('specialization', pathwayId, spec.id);

  const title = document.createElement('h3');
  title.className = 'text-md font-semibold mb-1';
  title.textContent = 'Specialization';

  section.appendChild(removeButton);
  section.appendChild(title);
  section.appendChild(createInput('Title', spec.title, 'text', { field: 'title', pathwayId, specId: spec.id }));
  section.appendChild(createInput('Description', spec.description, 'text', { field: 'description', pathwayId, specId: spec.id }));

  return section;
}

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
function createInput(label, value = '', type = 'text', dataset = {}) {
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  Object.keys(dataset).forEach(key => {
    input.dataset[key] = dataset[key];
  });

  // Add input event listener to update the content model
  input.addEventListener('input', (event) => updateModel(event));

  const container = document.createElement('div');
  container.innerHTML = `<label>${label}:</label>`;
  container.appendChild(input);
  return container;
}

// Updates the contentModel based on input fields
function updateModel(event) {
  const { field, pathwayId, specId } = event.target.dataset;
  const value = event.target.value;

  const pathway = contentModel.pathways.find(p => p.id == pathwayId);
  if (!pathway) return;

  if (specId) {
    const spec = pathway.specializations.find(s => s.id == specId);
    if (!spec) return;
    spec[field] = value;
  } else {
    pathway[field] = value;
  }

  // Update JSON preview without re-rendering the form
  document.getElementById('output').innerHTML = `<pre>${JSON.stringify(contentModel, null, 2)}</pre>`;
}

// Bind functions to window to make them globally accessible
window.addPathway = addPathway;
window.renderContent = renderContent;
window.renderPathway = renderPathway;
window.addSpecialization = addSpecialization;
window.renderSpecialization = renderSpecialization;
window.createInput = createInput;
window.updateModel = updateModel;
