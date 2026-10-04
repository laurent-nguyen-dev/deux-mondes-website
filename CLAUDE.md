# CLAUDE.md

Site vitrine de l'**Ensemble vocal des deux mondes** (ensemble vocal SATB, 4 chanteurs maximum par voix, baroque d'Europe et d'Amérique du Sud). Site **statique** construit avec [Zola](https://www.getzola.org/) 0.23, publié sur GitHub Pages : https://laurent-nguyen-dev.github.io/deux-mondes-website/

On parle français avec l'utilisateur. Le texte du site est en français.

## Commandes

- `zola serve` : site local sur http://127.0.0.1:1111 (rechargement automatique). L'utilisateur veut **voir le résultat avec `zola serve`** avant toute publication.
- `zola build` : génère `public/` (ignoré par git).
- Zola est installé dans `~/.local/bin` (build **musl** : le build standard exige une glibc plus récente que celle de ce WSL).
- Publication : chaque `git push` sur `main` déclenche `.github/workflows/deploy.yml` (installe Zola, construit avec la `base_url` de GitHub Pages, déploie). **Ne committer et ne pousser que sur demande explicite.**

## Structure

- `config.toml` : titre, description, `[extra]` (email, adresse, réseaux sociaux). `base_url` locale ; le workflow la remplace.
- `content/_index.md` : présentation (page d'accueil). `content/repertoire.md` : compositeurs. `content/contact.md`, `content/galerie/_index.md` (photos déposées dans ce dossier, vidéos YouTube dans le front matter), `content/concerts/` (un `.md` par concert : `date`, `extra.heure`, `extra.lieu`).
- `templates/` : `base.html` (titre, scène, panneau, pied de page), `index.html`, `page.html`, `concerts.html` (classement automatique à venir / passés), `galerie.html`, `contact.html`, `partials/concert.html`, `partials/garden.html` (la scène, voir plus bas).
- `static/css/style.css` (variables de couleur en tête de fichier), `static/js/main.js`.
- `.screenshots/` : captures et fichiers de travail, **ignorés par git**.

## Le concept visuel (à respecter)

Une scène de **lianes qui sont des liens entre les deux mondes** : Amérique du Sud à gauche, Europe à droite. Chaque liane relie une fleur sud-américaine à une fleur européenne, avec des segments en **escaliers incas** (ocre). Les silhouettes des deux continents sont en fond, très pâles.

- **Fleurs européennes = navigation** (cliquables) : lys/France = L'ensemble, rose du XV d'Angleterre/Angleterre = Concerts, bleuet/Allemagne = Galerie, œillet/Espagne = Contact.
- **Passiflore (Amérique du Sud) = Répertoire** (cliquable). Dahlia, cantuta et cattleya : **décoratives** pour l'instant, destinées à de futures sections.
- Cliquer une fleur affiche la page **dans le panneau du bas**, sans recharger la scène (`main.js`, `fetch` + `pushState`). Sans JavaScript, les fleurs restent de vrais liens.
- Mise en page **adaptative** : grande disposition (viewBox 1000×600) et disposition **portrait** pour téléphone (viewBox 600×780, `max-width: 40rem`). Les deux SVG sont dans `garden.html`, les positions des fleurs en variables CSS (`--x/--y` et `--tx/--ty`). Le texte grossit sur très grand écran (`html { font-size: max(100%, .9vw) }`) pour une télé.
- `partials/garden.html` a été **généré par un script** (non conservé) à partir de géométrie Bézier et de contours Natural Earth. Aujourd'hui on le **modifie à la main** ; vérifier les deux dispositions après toute modification.

## Choix et préférences de l'utilisateur

- Vocabulaire : « ensemble vocal », pas « chorale ». Nom exact : « Ensemble vocal des deux mondes ».
- **Pas de mode sombre.** Pas de formulaire de contact : seulement email, adresse postale, réseaux sociaux. **Pas de numéro de téléphone.** Pas de dates ni d'horaires de répétition (site vitrine).
- Les informations viennent de https://www.la-voix-et-les-doigts.fr/ensemble-vocal-des-deux-mondes/ (association La Voix et Les Doigts). **Ne rien inventer** sur le répertoire, l'histoire ou les concerts. Sans concert, le site affiche « Aucun concert programmé » : c'est voulu.
- À compléter par l'utilisateur : vrais liens Facebook/Instagram/YouTube (`config.toml`, encore génériques), photos, vidéos, premier concert.
- Le dessin des fleurs a été itéré en détail (reconnaissabilité : rose de profil façon XV d'Angleterre, lys parfait). Ne pas les redessiner sans demande.

## Pièges rencontrés

- **Zola 0.23 / Tera** : pas de `{% macro %}` (utiliser `{% include %}`) ; dates avec `locale` = format UTS-35 (`"EEEE d MMMM y"`), sans `locale` = strftime ; le test `is matching` prend `pat=` ; `get_url(path='concerts')` produit `/concerts` **sans barre finale** (le JS ne doit pas exiger `/`).
- Les liens `get_url` utilisent `base_url` : en ligne, le site vit sous `/deux-mondes-website/`.
- **Ne jamais utiliser `pkill -f`/`pgrep -f` avec un motif présent dans la commande elle-même** : le shell se tue (exit 144). Tuer par PID.

## Vérifier visuellement

Google Chrome est installé. Captures en tâche de fond :
`google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --window-size=1440,900 --screenshot=.screenshots/x.png http://127.0.0.1:1111/`
Tailles utiles : 390×1000 (téléphone), 820×1180 (tablette), 1440×900, 3840×2160 (télé). Le `scroll-behavior: smooth` bloque `--virtual-time-budget` : pour tester les clics, lancer Chrome en temps réel avec une page de test qui envoie ses résultats à un petit serveur local (puis supprimer la page de test).

## Sécurité

Site statique, sans serveur ni formulaire : le seul risque réel est le compte GitHub (activer la double authentification).

## Git

Branche `main`, dépôt public `laurent-nguyen-dev/deux-mondes-website`. Messages de commit en français ; terminer par la ligne `Co-Authored-By` indiquée dans le contexte de la session.
