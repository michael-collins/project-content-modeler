let contentModel = { projects: [] };  // Holds the dynamically generated JSON structure
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
  contentModel = { projects: [] };  // Start with an empty array for projects
  console.log("Initialized content model:", contentModel);  // Log the initialized content model
}

// Add a new project with pathways and specializations
function addProject() {
  const newProject = {
    id: Date.now().toString(),
    title: '',
    pathways: {
      pathwayId: '',
      pathwayName: '',
      specializations: []
    },
    associatedMaterials: [],
    productionSchedule: { startDate: '', endDate: '', weeks: [] },
    learningComponents: { lectures: [], quizzes: [], masteryExercises: [] }
  };
  contentModel.projects.push(newProject);
  renderContent();
}

// Add a new specialization to a pathway
function addSpecialization(pathwayItem) {
  const pathwayData = pathwayItem.data;
  const newSpecialization = { id: Date.now().toString(), title: '', description: '' };
  pathwayData.specializations.push(newSpecialization);
  renderContent();
}

// Add a learning component to a specific type (e.g., lectures, quizzes)
function addLearningComponent(componentType, projectIndex) {
  const project = contentModel.projects[projectIndex];
  const newComponent = { id: Date.now().toString(), title: '', content: '' };
  project.learningComponents[componentType].push(newComponent);
  renderContent();
}

// Remove an item from an array based on its index
function removeItem(array, index) {
  array.splice(index, 1);
  renderContent();
}

// Render the entire content model
function renderContent() {
  const container = document.getElementById('pathways');
  container.innerHTML = '';  // Clear existing content

  // Render each project
  contentModel.projects.forEach((project, projectIndex) => {
    const pathwayItem = document.createElement('pathway-item');
    pathwayItem.data = project.pathways;

    pathwayItem.addEventListener('add-specialization', () => addSpecialization(pathwayItem));
    pathwayItem.addEventListener('remove-pathway', () => removeItem(contentModel.projects, projectIndex));

    // Add specializations to the pathway
    project.pathways.specializations.forEach((spec, specIndex) => {
      const specializationItem = document.createElement('specialization-item');
      specializationItem.data = spec;

      specializationItem.addEventListener('remove-specialization', () => removeItem(project.pathways.specializations, specIndex));
      pathwayItem.shadowRoot.querySelector('#specializations').appendChild(specializationItem);
    });

    container.appendChild(pathwayItem);

    // Add learning components within each project
    for (const [componentType, components] of Object.entries(project.learningComponents)) {
      const componentContainer = document.createElement('div');
      componentContainer.className = 'learning-components';

      // Add a header if the component list is not empty
      if (components.length > 0) {
        const header = document.createElement('h3');
        header.className = 'text-md font-semibold mb-2';
        header.textContent = componentType.charAt(0).toUpperCase() + componentType.slice(1);
        componentContainer.appendChild(header);
      }

      // Render each learning component item
      components.forEach((component, componentIndex) => {
        const componentItem = document.createElement('learning-component-item');
        componentItem.data = component;
        componentItem.addEventListener('remove-learning-component', () => removeItem(components, componentIndex));
        componentContainer.appendChild(componentItem);
      });

      // Button to add a new learning component of the specified type
      const addComponentButton = document.createElement('button');
      addComponentButton.className = 'w-full mt-2 bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-600';
      addComponentButton.textContent = `Add ${componentType.slice(0, -1)}`;
      addComponentButton.onclick = () => addLearningComponent(componentType, projectIndex);
      componentContainer.appendChild(addComponentButton);

      container.appendChild(componentContainer);
    }
  });

  // Update JSON output
  document.getElementById('output').data = contentModel;
}

// Clear the content model and reset the display
function clearContent() {
  contentModel = { projects: [] };  // Reset to default structure
  console.log("Cleared content model:", contentModel);  // Log the cleared content model
  renderContent();
}

// Load configuration when the page is ready
window.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  
  // Attach functionality for buttons in the main UI
  document.getElementById('clear-button').addEventListener('click', clearContent);
  document.getElementById('add-project-button').addEventListener('click', addProject);
});
