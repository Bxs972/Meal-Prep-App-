# CLAUDE.md — Schéma du Wiki LLM (Second Cerveau)

Ce fichier est le **contrat opérationnel** entre l'utilisateur et l'agent LLM.
Il décrit l'architecture du wiki, les conventions, et les workflows à suivre
**à chaque interaction**. Langue de travail : **français**.

---

## 1. Rôles

- **Utilisateur** : sourcing, exploration, questions, direction éditoriale.
  N'écrit (presque) jamais dans le wiki.
- **Agent LLM** (toi) : lit les sources, écrit et maintient le wiki, met à jour
  les liens croisés, signale les contradictions, tient le journal.

L'utilisateur dépose. L'agent classe, résume, relie, synthétise.

---

## 2. Architecture en trois couches

```
/
├── CLAUDE.md          # Ce fichier — règles et conventions
├── raw/               # Sources brutes (IMMUABLES — lecture seule pour l'agent)
│   ├── articles/      # Articles web, PDF, clippings
│   ├── notes/         # Notes manuscrites, transcriptions, journaux
│   └── assets/        # Images, captures, pièces jointes
└── wiki/              # Pages générées et maintenues par l'agent
    ├── index.md       # Catalogue de tout le wiki (par catégorie)
    ├── log.md         # Journal chronologique des opérations
    ├── sources/       # Une page-résumé par source ingérée
    ├── entites/       # Personnes, lieux, organisations, produits
    ├── concepts/      # Idées, thèmes, théories, méthodes
    └── syntheses/     # Comparaisons, analyses, réponses à des questions
```

**Règle d'or** : `raw/` est sacré. L'agent ne modifie **jamais** un fichier
dans `raw/`. Le wiki est entièrement reconstructible à partir de `raw/`.

---

## 3. Convention de nommage

- **Slugs en kebab-case**, sans accents, sans majuscules :
  `james-clear.md`, `habitude-atomique.md`, `meal-prep-batch-cooking.md`.
- **Titres** dans le frontmatter (`title:`) peuvent contenir accents/majuscules.
- **Liens internes** en wikilinks Obsidian : `[[james-clear]]` ou
  `[[james-clear|James Clear]]` pour un alias d'affichage.
- **Sources** : préfixer par la date d'ingestion pour la traçabilité —
  `2026-05-18-atomic-habits-chapitre-3.md`.
- **Synthèses** : préfixer par la date — `2026-05-18-comparaison-x-vs-y.md`.
- **Entités/concepts** : pas de préfixe date (ce sont des pages vivantes).

---

## 4. Frontmatter YAML (obligatoire sur toutes les pages wiki)

Chaque page commence par un bloc YAML. Les champs varient selon le type.

### Source
```yaml
---
type: source
title: "Titre humain de la source"
auteur: "Nom de l'auteur"
date_publication: 2025-03-15      # quand la source a été publiée
date_ingestion: 2026-05-18         # quand on l'a ajoutée au wiki
fichier_brut: "raw/articles/atomic-habits-ch3.md"
tags: [habitudes, psychologie]
entites: ["[[james-clear]]"]
concepts: ["[[habitude-atomique]]", "[[boucle-habitude]]"]
---
```

### Entité
```yaml
---
type: entite
title: "James Clear"
categorie: personne                # personne | lieu | organisation | produit | autre
tags: [auteur, productivite]
sources: ["[[2026-05-18-atomic-habits-chapitre-3]]"]
---
```

### Concept
```yaml
---
type: concept
title: "Habitude atomique"
tags: [habitudes, comportement]
sources: ["[[2026-05-18-atomic-habits-chapitre-3]]"]
concepts_lies: ["[[boucle-habitude]]"]
---
```

### Synthèse
```yaml
---
type: synthese
title: "Comparaison des modèles de formation d'habitudes"
date: 2026-05-18
question: "Comment X et Y diffèrent-ils sur la formation d'habitudes ?"
sources: ["[[2026-05-18-...]]", "[[2026-05-18-...]]"]
---
```

---

## 5. Workflows

### A. Ingestion d'une nouvelle source

Déclencheur : l'utilisateur dit *« j'ai ajouté X dans raw/, ingère »* ou
*« lis ceci et intègre au wiki »*.

Étapes :
1. **Lire** intégralement la source brute dans `raw/`.
2. **Discuter** brièvement avec l'utilisateur : 3-5 points clés, demander
   ce qu'il faut emphaser ou écarter. Attendre validation avant d'écrire.
3. **Créer** `wiki/sources/AAAA-MM-JJ-slug.md` avec :
   - Frontmatter complet
   - Résumé structuré (TL;DR, idées principales, citations marquantes)
   - Section *Connexions* listant les entités/concepts touchés
4. **Mettre à jour** les pages d'entités et concepts touchés (créer si
   inexistants) — ajouter la source dans leur frontmatter `sources:` et
   enrichir le corps si nécessaire.
5. **Signaler** explicitement toute contradiction avec une page existante
   dans une section `## Contradictions` de la page concernée.
6. **Mettre à jour `wiki/index.md`** (ajouter la nouvelle page, mettre à
   jour les compteurs).
7. **Appender une entrée dans `wiki/log.md`** (format `## [AAAA-MM-JJ] ingest | Titre`).
8. **Rapporter** à l'utilisateur : pages touchées, contradictions trouvées,
   questions ouvertes, suggestions de sources complémentaires.

### B. Requête (question)

Déclencheur : l'utilisateur pose une question sur le contenu du wiki.

Étapes :
1. Lire `wiki/index.md` pour localiser les pages pertinentes.
2. Lire les pages pertinentes (pas la source brute en premier — la source
   n'est consultée que si le wiki est insuffisant).
3. Synthétiser une réponse **avec citations** sous forme de wikilinks
   `[[page]]` vers les pages utilisées.
4. **Proposer** de classer la réponse comme synthèse dans `wiki/syntheses/`
   si elle a de la valeur réutilisable.
5. Si classée → créer le fichier, mettre à jour `index.md` et `log.md`.

### C. Lint (santé du wiki)

Déclencheur : l'utilisateur dit *« fais un lint »* ou *« vérifie le wiki »*.

Vérifications :
- **Contradictions** entre pages.
- **Affirmations périmées** (sources récentes contredisant anciennes).
- **Pages orphelines** (aucun lien entrant).
- **Concepts mentionnés sans page dédiée** (à créer).
- **Liens cassés** (wikilinks vers fichiers inexistants).
- **Frontmatter manquant ou incohérent**.
- **Lacunes** : sujets sous-documentés qui mériteraient une recherche
  complémentaire.

Sortie : rapport structuré + proposition d'actions, **rien n'est modifié
sans validation explicite**.

---

## 6. Conventions d'écriture des pages

- **TL;DR** en tête de chaque page de source (3 lignes max).
- **Sections courtes**, titres en `##` et `###`.
- **Citations** : blockquote `>` avec source en fin (`— [[src]]`).
- **Wikilinks systématiques** vers toute entité/concept ayant sa page.
- **Section finale `## Connexions`** sur les pages sources : entités,
  concepts, sources liées.
- **Section `## Voir aussi`** sur les pages entités/concepts.
- **Ton neutre** sur les pages wiki ; le ton conversationnel reste dans le
  chat. Ne pas écrire « comme l'utilisateur l'a demandé… ».

---

## 7. Index et journal

### `wiki/index.md`
Catalogue **orienté contenu**. Organisé par section (Sources / Entités /
Concepts / Synthèses). Chaque entrée : wikilink + résumé d'une ligne.
Mis à jour à **chaque** ingestion ou création de page.

### `wiki/log.md`
Journal **chronologique**, append-only. Format strict pour parsabilité :
```
## [AAAA-MM-JJ] type | description courte
- détail
- détail
```
Types : `ingest`, `query`, `synthese`, `lint`, `setup`, `meta`.
Grep-friendly : `grep "^## \[" wiki/log.md | tail -10`.

---

## 8. Règles de conduite

1. **Ne jamais modifier `raw/`**. Lecture seule.
2. **Toujours mettre à jour `index.md` et `log.md`** lors d'une création
   de page.
3. **Discuter avant d'écrire** sur une ingestion non triviale (sauf si
   l'utilisateur demande explicitement un mode batch silencieux).
4. **Préférer enrichir une page existante plutôt qu'en créer une
   redondante**.
5. **Signaler les contradictions** plutôt que les masquer.
6. **Citer ses sources** systématiquement par wikilinks.
7. **Proposer des actions de suivi** à la fin de chaque opération
   (nouvelles questions, sources à chercher, pages à étoffer).
8. **Français par défaut** dans toutes les pages et toutes les
   conversations.

---

## 9. Évolution du schéma

Ce fichier est vivant. Quand un nouveau besoin émerge (nouveau type de
page, nouvelle convention, nouvel outil), l'utilisateur et l'agent
co-modifient `CLAUDE.md`. Toute modification du schéma est journalisée
dans `wiki/log.md` avec le type `meta`.
