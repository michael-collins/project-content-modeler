let accessToken = null;
let codeVerifier = null;

// Generate a random string for PKCE code verifier
function generateCodeVerifier() {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// Generate code challenge from code verifier
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Fetch the GitHub Client ID from the serverless function
async function fetchClientId() {
  const response = await fetch('https://github-auth-server.vercel.app/api/get-client-id');  // Adjust if using a custom API path
  const data = await response.json();
  return data.clientId;
}

// Initiate GitHub Authorization Code Flow with PKCE
async function authorizeGitHub() {
  codeVerifier = generateCodeVerifier();  // Generate PKCE code verifier
  const codeChallenge = await generateCodeChallenge(codeVerifier);  // Generate PKCE code challenge

  const clientId = await fetchClientId();  // Fetch Client ID from serverless function
  const redirectUri = 'https://project-content-modeler.vercel.app';  // Replace with your app's URL

  // Redirect user to GitHub for authorization
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  window.location.href = githubAuthUrl;
}

// Handle the redirect back from GitHub with authorization code
async function handleAuthorizationCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://github-auth-server.vercel.app/api/exchange-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code,
        client_id: await fetchClientId(),  // Fetch Client ID again if needed
        redirect_uri: 'https://project-content-modeler.vercel.app',  // Your app's URL
        code_verifier: codeVerifier
      })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.access_token) {
      accessToken = tokenData.access_token;
      alert('Authorization successful!');
      // Clear the URL of the authorization code for a clean look
      window.history.replaceState({}, document.title, '/');
    } else {
      console.error('Authorization failed:', tokenData);
    }
  }
}

// Attach the authorization function to a button click event
document.getElementById('authorize-button').addEventListener('click', authorizeGitHub);

// Run this function on page load to handle the authorization callback
handleAuthorizationCallback();
