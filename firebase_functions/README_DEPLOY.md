AGA MEDIA - Firebase Functions & Hosting (Angular)

What I created:
- functions/: Firebase Cloud Functions implementing `publishReports` and `syncSocial`.
- firebase.json and .firebaserc for hosting to Firebase.

Required environment variables (set in Firebase or GitHub Secrets):
- GITHUB_TOKEN: GitHub PAT with repo write access (used by functions to commit new content)
- GITHUB_OWNER: GitHub owner (e.g. "bapuku")
- GITHUB_REPO: GitHub repo name (e.g. "bapuku")
- TWITTER_BEARER: Twitter/X API bearer token
- INSTAGRAM_TOKEN: Instagram Graph API token
- FIREBASE_SERVICE_ACCOUNT (or use firebase login:ci to create FIREBASE_TOKEN)

How to deploy functions locally for testing:
1) cd firebase_functions/functions
2) npm install
3) firebase emulators:start --only functions

How to deploy to Firebase:
1) Install Firebase CLI and login: npm install -g firebase-tools && firebase login
2) Set your project id in .firebaserc
3) Configure environment variables: using `firebase functions:config:set` or set them in your cloud provider
4) cd firebase_functions && firebase deploy --only functions,hosting

Security notes:
- Keep GITHUB_TOKEN and social tokens secret. Use GitHub Secrets when using Actions.
- Rate limits: X and Instagram APIs have rate limits; implement backoff if you schedule frequent syncs.

GitHub Actions / Deployment workflow will be added under .github/workflows in the repo. You must copy firebase config to the repo root or adapt the workflow to the path.
