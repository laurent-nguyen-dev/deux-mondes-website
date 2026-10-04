# Ensemble vocal des deux mondes

Site web de l'ensemble vocal SATB dédié au baroque d'Europe et d'Amérique du Sud.
Site statique construit avec [Zola](https://www.getzola.org/), publié sur GitHub Pages.

## Modifier le site

- `content/concerts/` : un fichier `.md` par concert (date, heure, lieu).
- `content/galerie/` : déposer les photos ici ; les vidéos YouTube se déclarent dans `_index.md`.
- `content/_index.md` : texte de présentation.
- `config.toml` : titre, email, adresse, réseaux sociaux.
- `static/css/style.css` : couleurs et polices (variables en haut du fichier).

## Voir le site en local

```
zola serve
```

puis ouvrir http://127.0.0.1:1111. Chaque `git push` sur `main` republie le site.
