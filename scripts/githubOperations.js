async function saveToGitHub() {
  if (!accessToken) {
    alert('You need to authorize GitHub first.');
    return;
  }
  if (!selectedRepo) {
    alert('Please select a repository first.');
    return;
  }

  const path = 'content-model.json';
  const content = btoa(JSON.stringify(contentModel, null, 2)); // Encode content in base64
  const apiUrl = `https://api.github.com/repos/${selectedRepo}/contents/${path}`;

  // Check if file exists to determine create/update
  const fileResponse = await fetch(apiUrl, { headers: { Authorization: `token ${accessToken}` } });
  const fileData = fileResponse.ok ? await fileResponse.json() : null;
  const sha = fileData ? fileData.sha : null;

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Save content model JSON',
      content: content,
      sha: sha
    })
  });

  if (response.ok) {
    alert('JSON saved to GitHub successfully.');
  } else {
    alert('Failed to save JSON to GitHub.');
  }
}

async function loadFromGitHub() {
  if (!accessToken) {
    alert('You need to authorize GitHub first.');
    return;
  }
  if (!selectedRepo) {
    alert('Please select a repository first.');
    return;
  }

  const path = 'content-model.json';
  const apiUrl = `https://api.github.com/repos/${selectedRepo}/contents/${path}`;

  const response = await fetch(apiUrl, {
    headers: { Authorization: `token ${accessToken}` }
  });

  if (response.ok) {
    const data = await response.json();
    const content = JSON.parse(atob(data.content));
    contentModel = content;
    renderContent(); // Render content after loading
  } else {
    alert('Failed to load JSON from GitHub.');
  }
}
