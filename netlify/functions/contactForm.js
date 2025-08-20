const { Octokit } = require("@octokit/rest");

// Netlify Function for contact form
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
    const { name, email, subject, message } = JSON.parse(event.body);
    
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Name, email, and message are required' })
      };
    }

    // Create GitHub issue for contact form submission
    const octokit = new Octokit({ 
      auth: process.env.GITHUB_TOKEN 
    });

    const issueTitle = `Contact Form: ${subject || 'New Message'}`;
    const issueBody = `**Contact Form Submission**

**Name:** ${name}
**Email:** ${email}
**Subject:** ${subject || 'No subject'}

**Message:**
${message}

---
*Submitted via AGA Media website contact form*`;

    await octokit.issues.create({
      owner: process.env.GITHUB_OWNER || 'bapuku',
      repo: process.env.GITHUB_REPO || 'bapuku',
      title: issueTitle,
      body: issueBody,
      labels: ['contact-form', 'website']
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully' 
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to send message' })
    };
  }
};
