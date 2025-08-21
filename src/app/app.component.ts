import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-neutral-950 text-neutral-100">
      <!-- NAVBAR -->
      <header class="sticky top-0 z-50 backdrop-blur bg-neutral-950/70 border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="assets/img/2.png" alt="AGA Media mosaic" class="w-8 h-8 rounded-xl object-cover"/>
            <span class="font-semibold tracking-wide">AGA MEDIA INC - #AGAInfoDAILY</span>
          </div>
          <nav class="hidden md:flex items-center gap-6 text-sm">
            <a href="#accueil" class="hover:text-white/80">Accueil</a>
            <a href="#services" class="hover:text-white/80">Services</a>
            <a href="#analyses" class="hover:text-white/80">Analyses</a>
            <a href="#rapports" class="hover:text-white/80">Rapports</a>
            <a href="#medias" class="hover:text-white/80">Medias</a>
            <a href="#contact" class="hover:text-white/80">Contact</a>
          </nav>
        </div>
      </header>

      <!-- HERO -->
      <section id="accueil" class="relative">
        <div class="absolute inset-0">
          <img src="assets/img/1.png" alt="Times Square, actualite" class="w-full h-full object-cover opacity-40"/>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 pt-20 pb-28">
          <div class="max-w-3xl">
            <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
              Intelligence média & électorale au service de la décision
            </h1>
            <p class="mt-6 text-lg text-neutral-300">
              AGA MEDIA INC met en scène 30 ans de journalisme politique et des technologies d'intelligence artificielle pour analyser l'actualité, éclairer les élections africaines et produire des contenus d'impact.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <span class="px-3 py-1 bg-white/10 rounded-xl text-sm">Politique</span>
              <span class="px-3 py-1 bg-white/10 rounded-xl text-sm">Elections</span>
              <span class="px-3 py-1 bg-white/10 rounded-xl text-sm">Stratégie</span>
              <span class="px-3 py-1 bg-white/10 rounded-xl text-sm">IA appliquée</span>
            </div>
          </div>
        </div>
      </section>

      <!-- SERVICES -->
      <section id="services" class="max-w-7xl mx-auto px-4 py-16">
        <h2 class="text-3xl md:text-4xl font-bold">Domaines d'excellence</h2>
        <p class="mt-2 text-neutral-300">Analyses, prévisions et contenus pour gouvernements, médias, missions d'observation et organisations internationales.</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <img src="assets/img/2.png" alt="Analyse politique" class="h-36 w-full object-cover"/>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Analyse politique, économique & stratégique</h3>
              <p class="text-neutral-300">Veille 24/7, décryptages et briefs exécutifs basés sur 30 ans d'expérience et des modèles IA propriétaires.</p>
            </div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <img src="assets/img/7.png" alt="Analyses électorales" class="h-36 w-full object-cover"/>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Analyses & prévisions électorales (Afrique)</h3>
              <p class="text-neutral-300">Sondages hybrides, agrégation de signaux sociaux, cartographie des risques et projections de scénarios.</p>
            </div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <img src="assets/img/5.png" alt="Production médiatique" class="h-36 w-full object-cover"/>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Production de contenus médiatiques</h3>
              <p class="text-neutral-300">Reportages, plateaux, podcasts et formats immersifs pour télévision et plateformes numériques.</p>
            </div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <img src="assets/img/3.png" alt="Consultance stratégique" class="h-36 w-full object-cover"/>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Consultance politique & stratégique</h3>
              <p class="text-neutral-300">Stratégie de campagne, communication de crise, due diligence pays et diplomatie économique.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 py-8 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span>© 2025 AGA MEDIA INC · Tous droits réservés.</span>
          </div>
          <div class="flex items-center gap-4">
            <a href="https://x.com/MoohTeiDjouaka" target="_blank" class="hover:text-neutral-200 underline">Twitter / X</a>
            <a href="https://facebook.com/alexgustave" target="_blank" class="hover:text-neutral-200 underline">Facebook</a>
            <a href="https://instagram.com/agazebaze" target="_blank" class="hover:text-neutral-200 underline">Instagram</a>
            <a href="https://linkedin.com/in/alex-gustave" target="_blank" class="hover:text-neutral-200 underline">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'AGA MEDIA INC';
}
