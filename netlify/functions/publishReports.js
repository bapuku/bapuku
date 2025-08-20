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

  const { files } = JSON.parse(event.body);
  if (!files || !Array.isArray(files)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "files array required" })
    };
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    for (const f of files) {
      const r = await axios.get(f.url, { responseType: "arraybuffer" });
      const path = `content/reports/${f.name}`;
      await commitToGitHub(path, r.data, `Add report ${f.name}`, octokit);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};