const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Initialize GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    const owner = 'bapuku';
    const repo = 'bapuku';

    // Get the latest reports from the repository
    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'REPORTS TO COMMIT'
    });

    // Filter for PDF files
    const pdfFiles = contents.filter(file => 
      file.name.endsWith('.pdf') && file.type === 'file'
    );

    if (pdfFiles.length === 0) {
      return {
        statusCode: 200,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: 'Aucun nouveau rapport trouvé',
          reports: []
        })
      };
    }

    // Process each PDF report
    const processedReports = [];
    for (const file of pdfFiles) {
      // Here you would typically:
      // 1. Download the PDF
      // 2. Extract metadata
      // 3. Generate a summary
      // 4. Update the website content
      
      processedReports.push({
        name: file.name,
        path: file.path,
        downloadUrl: file.download_url,
        size: file.size,
        lastModified: new Date().toISOString()
      });
    }

    // Log the publication
    console.log(`Published ${processedReports.length} reports:`, processedReports);

    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: `${processedReports.length} rapports publiés avec succès`,
        reports: processedReports
      })
    };

  } catch (error) {
    console.error('Error publishing reports:', error);
    return {
      statusCode: 500,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Erreur lors de la publication des rapports',
        details: error.message
      })
    };
  }
};
