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
    ├── entites/       # Personnes, organisations, outils, conférences
    ├── concepts/      # Idées, algorithmes, méthodes, théorèmes, architectures
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

### Source (générique)
```yaml
---
type: source
sous_type: article          # article | papier | talk | doc | blog | post | autre
title: "Titre humain de la source"
auteurs: ["Nom Prénom", "Nom Prénom"]
date_publication: 2025-03-15      # quand la source a été publiée
date_ingestion: 2026-05-18         # quand on l'a ajoutée au wiki
fichier_brut: "raw/articles/slug.md"
url: "https://exemple.org/article"   # optionnel
tags: [llm, rag, infrastructure]
entites: ["[[hugging-face]]", "[[andrej-karpathy]]"]
concepts: ["[[retrieval-augmented-generation]]", "[[transformer]]"]
---
```

### Source — papier de recherche (champs additionnels)
```yaml
---
type: source
sous_type: papier
title: "Attention Is All You Need"
auteurs: ["Vaswani et al."]
venue: "NeurIPS 2017"
arxiv_id: "1706.03762"
doi: ""
date_publication: 2017-06-12
date_ingestion: 2026-05-18
fichier_brut: "raw/articles/2017-vaswani-attention.pdf"
tags: [transformer, attention, nlp]
entites: ["[[ashish-vaswani]]", "[[google-brain]]"]
concepts: ["[[transformer]]", "[[self-attention]]"]
---
```

### Entité
```yaml
---
type: entite
title: "Andrej Karpathy"
categorie: personne                # personne | organisation | outil | conference | autre
role: "chercheur, ex-OpenAI / Tesla"   # optionnel — fonction / rôle
tags: [llm, deep-learning]
sources: ["[[2026-05-18-karpathy-llm-os]]"]
---
```

Catégories d'entité utilisées dans ce wiki :
- **personne** : chercheur·e, ingénieur·e, auteur·e.
- **organisation** : laboratoire, entreprise, université, équipe open-source.
- **outil** : framework, librairie, produit logiciel, modèle nommé.
- **conference** : NeurIPS, ICLR, KubeCon, etc. — utile pour grouper plusieurs papiers.
- **autre** : tout ce qui ne rentre pas ailleurs (à éviter ; préférer ajouter
  une catégorie au schéma si le besoin se répète).

### Concept
```yaml
---
type: concept
title: "Retrieval-Augmented Generation"
nature: methode               # methode | algorithme | architecture | theoreme | idee | autre
tags: [llm, rag, recherche-information]
sources: ["[[2026-05-18-lewis-rag]]"]
concepts_lies: ["[[embedding]]", "[[vector-database]]"]
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

## 9. Domaine et mode de travail (préférences utilisateur)

- **Domaine** : recherche / veille technique (papiers, articles, talks,
  outils, frameworks). Le wiki se concentre sur les idées techniques,
  leurs auteurs, leurs implémentations.
- **Mode d'ingestion par défaut** : **pas à pas avec validation**. Pour
  chaque source, je fais d'abord un brief des points clés et j'attends
  un feu vert avant d'écrire dans le wiki. Pas de batch silencieux sans
  demande explicite.
- **Tags transverses suggérés** : `papier`, `talk`, `tutoriel`, plus le
  domaine technique (`llm`, `infra`, `compilers`, etc.).

---

## 10. Évolution du schéma

Ce fichier est vivant. Quand un nouveau besoin émerge (nouveau type de
page, nouvelle convention, nouvel outil), l'utilisateur et l'agent
co-modifient `CLAUDE.md`. Toute modification du schéma est journalisée
dans `wiki/log.md` avec le type `meta`.
