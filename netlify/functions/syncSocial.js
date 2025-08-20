const { Octokit } = require("@octokit/rest");
const axios = require("axios");

// Helper: commit file to GitHub
async function commitToGitHub(path, content, message, octokit) {
  try {
    const { data: existing } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path,
    });
    const sha = existing.sha;
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      sha,
    });
  } catch (e) {
    // not found -> create
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
    });
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const requestBody = JSON.parse(event.body || "{}");

  try {
    // 1) X/Twitter recent tweets by username
    if (process.env.TWITTER_BEARER) {
      const twitterUser = requestBody?.twitter_username || "MoohTeiDjouaka";
      const twResp = await axios.get(`https://api.twitter.com/2/users/by/username/${twitterUser}`, {
        headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` },
      });
      const userId = twResp.data.data.id;
      const tweets = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at,text`, {
        headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` },
      });
      for (const t of tweets.data.data || []) {
        const slug = `x-${t.id}.md`;
        const md = `---\ntitle: "Post X ${t.id}"\ndate: "${t.created_at}"\nsource: "x"\n---\n\n${t.text}`;
        await commitToGitHub(`content/editos/${slug}`, md, `Sync X post ${t.id}`, octokit);
      }
    }

    // 2) Instagram recent posts
    if (process.env.INSTAGRAM_TOKEN) {
      const igUserId = requestBody?.instagram_user_id;
      const igUrl = igUserId
        ? `https://graph.instagram.com/${igUserId}/media?access_token=${process.env.INSTAGRAM_TOKEN}&fields=id,caption,timestamp,media_url`
        : `https://graph.instagram.com/me/media?access_token=${process.env.INSTAGRAM_TOKEN}&fields=id,caption,timestamp,media_url`;
      const igResp = await axios.get(igUrl);
      for (const p of igResp.data.data || []) {
        const slug = `ig-${p.id}.md`;
        const md = `---\ntitle: "Instagram ${p.id}"\ndate: "${p.timestamp}"\nsource: "instagram"\n---\n\n${p.caption || ""}\n\n![](${p.media_url})`;
        await commitToGitHub(`content/editos/${slug}`, md, `Sync IG post ${p.id}`, octokit);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};