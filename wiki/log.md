---
type: log
title: "Journal du Wiki"
---

# Journal du Wiki

Append-only. Chronologie des opérations.
Format : `## [AAAA-MM-JJ] type | description`
Types : `setup`, `ingest`, `query`, `synthese`, `lint`, `meta`.

Astuce : `grep "^## \[" wiki/log.md | tail -10` pour voir les 10 dernières
opérations.

---

## [2026-05-18] setup | Initialisation du wiki
- Création de l'arborescence : `raw/{articles,notes,assets}`, `wiki/{sources,entites,concepts,syntheses}`.
- Rédaction de `CLAUDE.md` (schéma complet, conventions, workflows).
- Création de `wiki/index.md` et `wiki/log.md`.
- Convention de nommage adoptée : kebab-case, sans accents, préfixe date pour sources et synthèses.
- Frontmatter YAML obligatoire sur toutes les pages.

## [2026-05-18] ingest | Démo — batch-cooking-101
- Source brute : `raw/articles/batch-cooking-101.md` (texte de démonstration).
- Page source créée : [[2026-05-18-batch-cooking-101]].
- Entité créée : [[demo-auteur]].
- Concepts créés : [[batch-cooking]], [[meal-prep]].
- Index mis à jour (compteurs : 1 source, 1 entité, 2 concepts).
- Aucune contradiction (premier contenu).
- Suggestion de suivi : remplacer la démo par des sources réelles dès que l'utilisateur définit son domaine.

## [2026-05-18] meta | Choix du domaine — veille technique
- Domaine retenu : **recherche / veille technique**.
- Mode d'ingestion par défaut : **pas à pas avec validation**.
- `CLAUDE.md` mis à jour :
  - Catégories d'entité élargies : personne, organisation, outil, conference, autre.
  - Champ `nature` ajouté aux concepts (methode | algorithme | architecture | theoreme | idee | autre).
  - Sous-type ajouté aux sources (article | papier | talk | doc | blog | post | autre).
  - Frontmatter dédié aux papiers : `arxiv_id`, `doi`, `venue`.
  - Nouvelle section §9 « Domaine et mode de travail ».
- Suppression de la démo meal-prep (raw + 4 pages wiki) pour repartir propre.
- Index réinitialisé avec les sections adaptées (Personnes / Organisations / Outils / Conférences).
- Wiki vide, prêt à accueillir la première vraie source.
