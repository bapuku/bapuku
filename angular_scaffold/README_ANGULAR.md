Angular site scaffold instructions for AGA MEDIA INC

This repository will host an Angular site deployed to Firebase Hosting. Follow these steps locally to create the app and integrate the provided Firebase functions.

1) Create the Angular app
   npm install -g @angular/cli
   ng new aga-media --routing --style=css
   cd aga-media

2) Add Tailwind CSS (optional) - recommended for parity with existing styles
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   // configure tailwind.config.js and add directives to styles.css

3) Copy images
   // Copy the IMAGES/ folder content from your workspace into `aga-media/src/assets/img/`

4) Create pages/components
   - HomeComponent (shows hero, services, analyses, gallery)
   - ReportsComponent (lists PDFs from assets or a remote content/reports/ directory)
   - EditosComponent (renders markdown files from content/editos/ or pulls via API)
   - ContactComponent (contact form that POSTs to Firebase function URL)

5) Integrate deploy
   - Add Firebase Hosting config using `firebase init hosting` in the Angular project root
   - Build: `ng build --configuration production` -> output in `dist/aga-media`
   - Deploy: `firebase deploy --only hosting`

6) CI/CD (GitHub Actions)
   - Configure workflow to install Node, build Angular, run firebase deploy using FIREBASE_SERVICE_ACCOUNT secret

7) Content sync
   - Use the Cloud Function `syncSocial` endpoint to generate markdown into repo
   - Editos page should read markdown files from the repo (either bundled at build-time or fetched from the GitHub repo raw URLs at runtime)

Notes:
- I added a firebase_functions/ folder to your workspace with functions and firebase.json. Copy or adapt them to the Angular project root when ready.
- Provide GitHub repo and set secrets before running the automated workflows.
