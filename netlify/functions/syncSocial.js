const { Octokit } = require("@octokit/rest");

// Netlify Function to sync social media posts
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
    const octokit = new Octokit({ 
      auth: process.env.GITHUB_TOKEN 
    });

    const requestBody = event.body ? JSON.parse(event.body) : {};

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

    let syncedPosts = [];

    // 1) Sync X/Twitter posts
    if (process.env.TWITTER_BEARER) {
      try {
        const twitterUser = requestBody.twitter_username || "MoohTeiDjouaka";
        
        // Get user ID
        const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${twitterUser}`, {
          headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` }
        });
        const userData = await userResponse.json();
        
        if (userData.data) {
          const userId = userData.data.id;
          
          // Get recent tweets
          const tweetsResponse = await fetch(
            `https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at,text`, 
            {
              headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` }
            }
          );
          const tweetsData = await tweetsResponse.json();
          
          if (tweetsData.data) {
            for (const tweet of tweetsData.data) {
              const slug = `x-${tweet.id}.md`;
              const markdown = `---
title: "Post X ${tweet.id}"
date: "${tweet.created_at}"
source: "x"
author: "Alex Gustave Azebaze"
---

${tweet.text}`;
              
              await commitToGitHub(`content/editos/${slug}`, markdown, `Sync X post ${tweet.id}`);
              syncedPosts.push({ platform: 'X', id: tweet.id });
            }
          }
        }
      } catch (error) {
        console.error('Twitter sync error:', error);
      }
    }

    // 2) Sync Instagram posts
    if (process.env.INSTAGRAM_TOKEN) {
      try {
        const instagramUserId = requestBody.instagram_user_id;
        const igUrl = instagramUserId
          ? `https://graph.instagram.com/${instagramUserId}/media?access_token=${process.env.INSTAGRAM_TOKEN}&fields=id,caption,timestamp,media_url`
          : `https://graph.instagram.com/me/media?access_token=${process.env.INSTAGRAM_TOKEN}&fields=id,caption,timestamp,media_url`;
        
        const igResponse = await fetch(igUrl);
        const igData = await igResponse.json();
        
        if (igData.data) {
          for (const post of igData.data.slice(0, 5)) { // Limit to 5 recent posts
            const slug = `ig-${post.id}.md`;
            const markdown = `---
title: "Instagram ${post.id}"
date: "${post.timestamp}"
source: "instagram"
author: "Alex Gustave Azebaze"
---

${post.caption || ""}

${post.media_url ? `![Instagram Post](${post.media_url})` : ""}`;
            
            await commitToGitHub(`content/editos/${slug}`, markdown, `Sync IG post ${post.id}`);
            syncedPosts.push({ platform: 'Instagram', id: post.id });
          }
        }
      } catch (error) {
        console.error('Instagram sync error:', error);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        success: true, 
        message: 'Social media sync completed',
        synced: syncedPosts 
      })
    };

  } catch (error) {
    console.error('Sync error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
