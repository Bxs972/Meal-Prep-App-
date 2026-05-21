---
type: source
sous_type: article
title: "Maîtriser l'IA : les 30 compétences indispensables en 2026"
auteurs: ["Gaétan Roisnel"]
date_publication: 2025-12-07
date_ingestion: 2026-05-21
fichier_brut: "raw/articles/2025-12-07-yes-we-prompt-30-competences-ia-2026.md"
url: "https://yes-we-prompt.fr/strategie-ia/competences-ia-2026/"
tags: [article, vulgarisation, formation, prompt-engineering, competences-ia]
entites: ["[[yes-we-prompt]]"]
concepts: ["[[prompt-rcorcf]]", "[[agentic-ai]]", "[[function-calling]]"]
---

# Maîtriser l'IA : les 30 compétences indispensables en 2026

> **TL;DR** — Cartographie pédagogique française des « compétences IA »
> à acquérir, structurée en **4 familles** (automatiser, créer,
> sécuriser, maîtriser les outils) × **5 niveaux de maturité**, avec
> la méthode de prompt [[prompt-rcorcf]] présentée comme socle.
> Utile comme **vue d'ensemble** pour orienter d'autres ingestions, mais
> **source commerciale** (organisme de formation) — statistiques non
> sourcées, à ne pas citer comme référence technique.

## Métadonnées

- **Auteur** : Gaétan Roisnel — fondateur de [[yes-we-prompt]] *(pas de
  page dédiée auteur pour l'instant, cohérence avec la convention
  « version allégée »)*.
- **Publication** : 2025-12-07.
- **Type** : article de blog / lead magnet.

## Cartographie des 4 familles de compétences

L'article répartit les compétences en 4 grandes branches. La numérotation
ci-dessous suit celle de la source.

### Famille 1 — Automatiser (productivité)

1. **Instructions personnalisées** (*Custom Instructions* ChatGPT) :
   couche de mémoire persistante qui injecte automatiquement contexte,
   audience et style dans tous les échanges.
2. **Prompt System / Mégaprompt** : prompt complexe qui programme le
   comportement de l'IA (raisonnement, étapes, format de sortie).
3. **Assistants IA personnalisés** : IA configurée pour un rôle métier
   (Custom GPT, Gem Gemini), combinant Prompt System + données métier.
4. **Connecteurs MCP** (Model Context Protocol) : « ports USB de
   l'IA », standard pour brancher l'IA sur les logiciels métier sans
   passer par une API custom — voir [[function-calling]].
5. **Workflows automatisés** : scénarios multi-outils via Make, n8n,
   Zapier.
6. **RAG** (Retrieval-Augmented Generation) : consultation d'une base
   documentaire externe avant génération, pour réponses ancrées sur
   les données internes.
7. **API et agents IA** : sommet de l'échelle ; agents capables de
   raisonner et de s'adapter, par opposition aux workflows
   prédéfinis — voir [[agentic-ai]].

### Famille 2 — Créer du contenu

1. **Prompts Few-Shot** : fournir des exemples avant la demande pour
   cloner un style / une structure.
2. **Prompts Deepsearch** : recherche documentaire avec vérification de
   sources via Perplexity, ChatGPT Recherche approfondie, Gemini
   DeepResearch.
3. **Génération de visuels IA** : text-to-image et image-to-image.
4. **Génération de slides IA** : Gamma, Canva IA, à partir d'un plan.
5. **Contenus IA « Human Proof »** : techniques rédactionnelles pour
   passer les détecteurs anti-IA (GPT Zero) et le filtre algorithmique
   SEO.
6. **Vibecoding** : développement web par prompts en langage naturel.
7. **Génération vidéo et son** : text-to-video, text-to-speech.
8. **Génération d'avatars IA** : clones numériques pour formation,
   prospection, traduction multilingue.

### Famille 3 — Sécuriser (fiabilité)

1. **Gestion des données et mémoire de l'IA** : où vont les données,
   options de confidentialité, lutte contre le *shadow IA*.
2. **Contrôle des hallucinations** : fact-checking, ancrage sur sources
   fiables.
3. **Conformité RGPD** : anonymisation des prompts, droit à l'oubli.
4. **Conformité IA Act** : audit des niveaux de risque selon le
   règlement européen.
5. **Maîtrise des biais IA** : détection et correction des stéréotypes
   issus des données d'entraînement.

### Famille 4 — Maîtriser les outils (technique)

L'article remplace ici une liste de compétences par une **table de
mapping outils ↔ niveaux** :

| Niveau | Type | Outils cités |
|--------|------|--------------|
| 1 | IA généralistes | ChatGPT, Claude, Gemini, Mistral |
| 2 | Deepsearch | Perplexity |
| 2 | Images/vidéos | Nano Banana, Veo, Ideogram, Midjourney, Leonardo |
| 3 | Slides | Gamma, Canva IA |
| 3 | Son/voix | ElevenLabs, Suno |
| 3 | Automatisation | Make, Zapier, n8n |
| 4 | Avatars | HeyGen, Synthesia |

**Cohérence du décompte** : titre annonce 30, texte en énumère ~27 +
RCORCF + table d'outils. Pas critique mais à signaler.

## Le socle : prompt RCORCF

Méthode mnémotechnique pour structurer un prompt selon 6 piliers :
**R**ôle, **C**ontexte, **O**bjectif, **R**ésultat, **C**ontraintes,
**F**ormat. Voir page concept dédiée [[prompt-rcorcf]].

## Échelle de maturité 5 niveaux

| Niveau | Nom | % pros (selon l'article) | Description |
|--------|-----|--------------------------|-------------|
| 0 | Découverte | 65 % | Test sans méthode, résultats aléatoires |
| 1 | Initiation | 20 % | Structure ses prompts, utilise les bases |
| 2 | Opérationnel | 10 % | Assistants configurés sur contexte métier (cible recommandée par l'auteur) |
| 3 | Avancé | 5 % | Automatisation de process complets, maîtrise des risques |
| 4 | Expert | <1 % | Agents autonomes, RAG sur-mesure, R&D technique |

L'auteur recommande **viser le niveau 2 en 3 mois** comme objectif
réaliste pour 99 % des professionnels.

## Trois « fausses croyances » démontées

1. **« Les modèles IA vont devenir surpuissants »** → écarts entre
   modèles qui se réduisent (contraintes infra/énergie), la
   différenciation se joue sur l'usage, pas l'outil.
2. **« L'IA est de plus en plus simple à utiliser »** → l'inverse :
   chaque mise à jour introduit de nouveaux paramètres, options,
   connecteurs à maîtriser.
3. **« L'IA est un métier d'experts techniques »** → l'IA devient une
   compétence transversale métier, comme le Pack Office il y a 10 ans.

## Statistiques citées (à prendre avec précaution)

- 10 % des utilisateurs IA en France maîtrisent les fonctionnalités de base.
- 65 % utilisent l'IA comme un moteur de recherche.
- « Exploitent à peine 1 % de la puissance des modèles ».
- 90 % des dirigeants placent les compétences IA en priorité.
- Un utilisateur teste en moyenne 6 outils IA différents.

**Aucune de ces statistiques n'est sourcée méthodologiquement** : pas
d'échantillon, pas de protocole. Le seul lien externe d'études pointe
vers un post de blog Workera. À traiter comme **ordre de grandeur
défendu par l'auteur**, pas comme données solides.

## Caveats — à lire avant de citer

- **Source commerciale** : Yes We Prompt est un organisme de
  formation IA. L'article contient une quinzaine de liens internes vers
  audit gratuit, formations payantes, Prompt Academy, etc. C'est un
  *lead magnet*.
- **Auto-référence** : l'article qualifie sa propre liste de
  « cartographie officielle » et le RCORCF de « standard industriel ».
  Aucune institution ne valide ces qualifications — c'est la
  catégorisation maison de l'éditeur.
- **Marketing speak** : usage abondant de 💡/👉, urgence rhétorique
  (« 90 % des dirigeants »), absence de nuances dans les chiffres.
- **Définitions parfois imprécises** : ex. RAG décrit comme « plus
  flexible que le fine-tuning » sans détailler les trade-offs réels
  (qualité, latence, coût).

**Statut dans le wiki** : à traiter comme **carte mentale / vue
d'ensemble pédagogique du paysage IA grand public français** —
utile pour situer des sujets et identifier des concepts à creuser,
**pas pour les définitions techniques** (qui doivent venir de surveys
ou documentations primaires).

## Connexions

- **Entités** : [[yes-we-prompt]]
- **Concepts** : [[prompt-rcorcf]] (créé), [[agentic-ai]] (cité via la
  compétence #7 « API et agents IA »), [[function-calling]] (cité via
  MCP).
- **Sources liées** : [[2026-05-18-agentic-ai-fleet-management]] —
  pont sur la thématique agents IA et MCP.

## Pistes de suivi

- **Concepts évoqués mais pas approfondis** ici, à créer à mesure que
  des sources techniques arrivent : MCP, RAG, deepsearch, few-shot,
  vibecoding, Human Proof, IA Act, RGPD, biais IA, hallucinations.
- **Comparaison RCORCF vs autres mnémotechniques** (CRISPE, RACE,
  CO-STAR, CLEAR) : à instruire si une source comparative apparaît.
- **Vérifier la statistique des 10 %** : chercher si elle vient d'une
  étude indépendante (Workera, France Num, baromètres) plutôt que du
  blog de l'éditeur.
- **Sources connexes potentielles** : baromètre IA des PME (cité dans
  l'article), guides de prompt engineering OpenAI / Google / Anthropic
  (sources primaires).
