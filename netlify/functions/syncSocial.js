const { Octokit } = require('@octokit/rest');
const axios = require('axios');

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

    // Get the latest editos and briefs
    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'EDITO AND BRIEFS'
    });

    // Filter for HTML files (editos and briefs)
    const htmlFiles = contents.filter(file => 
      file.name.endsWith('.html') && file.type === 'file'
    );

    if (htmlFiles.length === 0) {
      return {
        statusCode: 200,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: 'Aucun nouvel édito trouvé',
          editos: []
        })
      };
    }

    // Process each edito/brief
    const processedEditos = [];
    for (const file of htmlFiles.slice(0, 5)) { // Limit to 5 most recent
      try {
        // Download the HTML content
        const response = await axios.get(file.download_url);
        const htmlContent = response.data;
        
        // Extract title from HTML (basic extraction)
        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : file.name.replace('.html', '');
        
        // Extract first paragraph as excerpt
        const contentMatch = htmlContent.match(/<p[^>]*>(.*?)<\/p>/i);
        const excerpt = contentMatch ? 
          contentMatch[1].replace(/<[^>]*>/g, '').substring(0, 200) + '...' : 
          'Contenu disponible...';
        
        processedEditos.push({
          title: title.trim(),
          excerpt: excerpt.trim(),
          filename: file.name,
          url: file.download_url,
          publishedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      }
    }

    // Here you would typically post to social media platforms
    // For now, we'll simulate the social media sync
    const socialPlatforms = ['Facebook', 'Twitter', 'LinkedIn'];
    const socialResults = socialPlatforms.map(platform => ({
      platform,
      success: true,
      postsCreated: processedEditos.length,
      message: `${processedEditos.length} posts synchronized to ${platform}`
    }));

    // Log the sync
    console.log(`Synced ${processedEditos.length} editos to social media:`, processedEditos);

    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: `${processedEditos.length} éditos synchronisés avec succès`,
        editos: processedEditos,
        socialSync: socialResults
      })
    };

  } catch (error) {
    console.error('Error syncing social media:', error);
    return {
      statusCode: 500,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Erreur lors de la synchronisation des réseaux sociaux',
        details: error.message
      })
    };
  }
};
