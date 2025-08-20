const { Octokit } = require("@octokit/rest");

// Netlify Function to publish reports to GitHub
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { files } = JSON.parse(event.body);
    
    if (!files || !Array.isArray(files)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'files array required' })
      };
    }

    const octokit = new Octokit({ 
      auth: process.env.GITHUB_TOKEN 
    });

    // Helper function to commit file to GitHub
    async function commitToGitHub(path, content, message) {
      try {
        // Try to get existing file
        const { data: existing } = await octokit.repos.getContent({
          owner: process.env.GITHUB_OWNER || 'bapuku',
          repo: process.env.GITHUB_REPO || 'bapuku',
          path,
        });
        
        // Update existing file
        await octokit.repos.createOrUpdateFileContents({
          owner: process.env.GITHUB_OWNER || 'bapuku',
          repo: process.env.GITHUB_REPO || 'bapuku',
          path,
          message,
          content: Buffer.from(content).toString("base64"),
          sha: existing.sha,
        });
      } catch (e) {
        // File doesn't exist, create new
        await octokit.repos.createOrUpdateFileContents({
          owner: process.env.GITHUB_OWNER || 'bapuku',
          repo: process.env.GITHUB_REPO || 'bapuku',
          path,
          message,
          content: Buffer.from(content).toString("base64"),
        });
      }
    }

    // Process each file
    for (const file of files) {
      const response = await fetch(file.url);
      const arrayBuffer = await response.arrayBuffer();
      const path = `content/reports/${file.name}`;
      await commitToGitHub(path, arrayBuffer, `Add report ${file.name}`);
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, message: 'Reports published successfully' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
