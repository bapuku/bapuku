const functions = require("firebase-functions");
const { Octokit } = require("@octokit/rest");
const axios = require("axios");

// Environment variables expected (set these in Firebase config or GitHub secrets):
// GITHUB_TOKEN - personal access token with repo access
// GITHUB_OWNER - e.g., "bapuku"
// GITHUB_REPO - e.g., "bapuku"
// TWITTER_BEARER - X/Twitter API Bearer token
// INSTAGRAM_TOKEN - Instagram Graph API token

// Helper: commit file to GitHub
async function commitToGitHub(path, content, message, octokit) {
  // Get current file sha (if exists)
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

// Publishes a report by committing the PDF binary into the repo under content/reports/
exports.publishReports = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  const { files } = req.body; // expect [{ name: "file.pdf", url: "https://..." }]
  if (!files || !Array.isArray(files)) return res.status(400).send("files array required");

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    for (const f of files) {
      const r = await axios.get(f.url, { responseType: "arraybuffer" });
      const path = `content/reports/${f.name}`;
      await commitToGitHub(path, r.data, `Add report ${f.name}`);
    }
    res.status(200).send({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// Sync social posts from X/Twitter and Instagram -> create/update markdown in content/editos/
exports.syncSocial = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    // 1) X/Twitter recent tweets by username
    if (process.env.TWITTER_BEARER) {
      const twitterUser = req.body?.twitter_username || "MoohTeiDjouaka";
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
        await commitToGitHub(`content/editos/${slug}`, md, `Sync X post ${t.id}`);
      }
    }

    // 2) Instagram recent posts (requires Instagram Graph API token and user id)
    if (process.env.INSTAGRAM_TOKEN) {
      const igUserId = req.body?.instagram_user_id; // optional
      const igUrl = igUserId
        ? `https://graph.instagram.com/${igUserId}/media?access_token=${process.env.INSTAGRAM_TOKEN}&fields=id,caption,timestamp,media_url`
        : `https://graph.instagram.com/me/media?access_token=${process.env.INSTAGRAM_TOKEN}&fields=id,caption,timestamp,media_url`;
      const igResp = await axios.get(igUrl);
      for (const p of igResp.data.data || []) {
        const slug = `ig-${p.id}.md`;
        const md = `---\ntitle: "Instagram ${p.id}"\ndate: "${p.timestamp}"\nsource: "instagram"\n---\n\n${p.caption || ""}\n\n![](${p.media_url})`;
        await commitToGitHub(`content/editos/${slug}`, md, `Sync IG post ${p.id}`);
      }
    }

    res.status(200).send({ ok: true });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).send({ error: err.message });
  }
});
