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
  section.className = 'section';
  section.dataset.pathwayId = pathway.id;

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-btn';
  removeButton.textContent = 'Remove';
  removeButton.onclick = () => removeItem('pathway', pathway.id);

  const title = document.createElement('h2');
  title.textContent = 'Pathway';

  section.appendChild(removeButton);
  section.appendChild(title);
  section.appendChild(createInput('Title', pathway.title, 'text', { field: 'title', pathwayId: pathway.id }));
  section.appendChild(createInput('Description', pathway.description, 'text', { field: 'description', pathwayId: pathway.id }));

  const specializationContainer = document.createElement('div');
  specializationContainer.className = 'nested';

  const specializationTitle = document.createElement('h3');
  specializationTitle.textContent = 'Specializations';
  specializationContainer.appendChild(specializationTitle);

  pathway.specializations.forEach(spec => {
    specializationContainer.appendChild(renderSpecialization(pathway.id, spec));
  });

  const addSpecializationButton = document.createElement('button');
  addSpecializationButton.textContent = 'Add Specialization';
  addSpecializationButton.onclick = () => addSpecialization(pathway.id); // Use global addSpecialization function
  specializationContainer.appendChild(addSpecializationButton);

  section.appendChild(specializationContainer);
  return section;
}

function renderSpecialization(pathwayId, spec) {
  const section = document.createElement('div');
  section.className = 'section';
  section.dataset.specId = spec.id;

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-btn';
  removeButton.textContent = 'Remove';
  removeButton.onclick = () => removeItem('specialization', pathwayId, spec.id);

  const title = document.createElement('h3');
  title.textContent = 'Specialization';

  section.appendChild(removeButton);
  section.appendChild(title);
  section.appendChild(createInput('Title', spec.title, 'text', { field: 'title', pathwayId, specId: spec.id }));
  section.appendChild(createInput('Description', spec.description, 'text', { field: 'description', pathwayId, specId: spec.id }));

  return section;
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
