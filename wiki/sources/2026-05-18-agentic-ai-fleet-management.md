---
type: source
sous_type: papier
title: "Agentic AI for Autonomous Fleet Management: A Function-Calling Architecture for Intelligent Vehicle Inventory Systems"
auteurs: ["P. Sahana", "Sohan Gowda S", "Akash K. G"]
venue: "IARJSET — Vol. 12, Issue 12"
doi: "10.17148/IARJSET.2025.121243"
date_publication: 2025-12
date_ingestion: 2026-05-18
fichier_brut: "raw/articles/2025-12-iarjset-agentic.md"
url: "https://iarjset.com/wp-content/uploads/2025/12/IARJSET.2025.121243-Agentic.pdf"
tags: [papier, agentic-ai, function-calling, llm, fleet-management]
entites: ["[[maharaja-institute-of-technology-mysore]]", "[[iarjset]]", "[[gemini-2-0-flash]]", "[[fastapi]]", "[[sqlite]]"]
concepts: ["[[agentic-ai]]", "[[function-calling]]", "[[fleet-management]]"]
---

# Agentic AI for Autonomous Fleet Management

> **TL;DR** — Preuve de concept d'un système d'inventaire automobile
> piloté en langage naturel : [[gemini-2-0-flash]] + [[fastapi]] +
> [[sqlite]], avec [[function-calling]] pour traduire les commandes en
> opérations CRUD validées. Apport principal : le pattern *function
> schemas comme contrat* entre LLM et base de données. Caveats
> méthodologiques sérieux (voir plus bas) — à traiter comme
> illustration d'un pattern, pas comme benchmark.

## Métadonnées

- **Auteurs** : P. Sahana, Sohan Gowda S, Akash K. G — étudiants
  Computer Science Engineering (AIML), [[maharaja-institute-of-technology-mysore]].
- **Venue** : [[iarjset]] — Vol. 12, Issue 12, décembre 2025.
- **DOI** : [10.17148/IARJSET.2025.121243](https://doi.org/10.17148/IARJSET.2025.121243).

## Idées principales

### 1. Function-calling comme colonne vertébrale de l'agent

Le cœur du système n'est pas le LLM lui-même mais le **catalogue de
*function schemas*** qui lui est exposé : `createVehicleRecord()`,
`getAvailabilityStatus()`, `generateAnalytics()`, etc. Chaque schéma
spécifie les paramètres attendus et leurs contraintes de type.

Boucle d'exécution :
1. L'utilisateur tape une commande en langage naturel.
2. Le LLM ([[gemini-2-0-flash]]), avec l'historique de session, identifie
   l'intention et extrait les entités (marque, modèle, statut…).
3. Le LLM choisit une fonction et propose des paramètres.
4. Le système **valide les paramètres contre le schéma** avant d'appeler
   la fonction Python correspondante.
5. La fonction touche la base via SQLAlchemy + [[sqlite]].
6. Le résultat est renvoyé en langage naturel à l'utilisateur, la
   session est mise à jour.

C'est ce pattern, plus que le cas d'usage automobile, qui mérite
d'être indexé — voir [[function-calling]].

### 2. Architecture trois tiers

- **Présentation** : HTML5/CSS3/JS (ES6), à la fois formulaire classique
  et interface de chat — coexistence des deux modes d'interaction.
- **Métier** : [[fastapi]] (async) — API, sessions, orchestration de
  l'agent.
- **Données** : [[sqlite]] + SQLAlchemy ORM.

Session par ID pour préserver le contexte conversationnel : messages
précédents, fonctions appelées, résultats — réinjectés dans le prompt.

### 3. Périmètre fonctionnel

CRUD complet sur les véhicules (marque, modèle, année, couleur,
kilométrage, statut), plus des fonctions d'analyse agrégée. Soft delete
pour préserver l'audit trail. Validation à trois niveaux : type, champs
obligatoires, règles métier (année plausible, kilométrage ≥ 0, statut
dans un set fini).

## Résultats annoncés par les auteurs

Sur **500 cas de test** et **300 scénarios de commandes** :

| Métrique | Avant | Après | Δ |
|----------|-------|-------|---|
| Temps de saisie moyen | 112 s | 45 s | −60 % |
| Temps de réponse DB (simple) | 800 ms | 450 ms | −44 % |
| Précision d'interprétation NLP | — | 95 % | — |
| Utilisateurs concurrents | 20 | 50 | +150 % |
| Satisfaction utilisateur | 6,2/10 | 8,7/10 | +40 % |
| Temps de formation | 2 h | 10 min | −92 % |
| Uptime (sur 3 semaines) | — | 99 % | — |

Les opérations NLP prennent 3-5 s par requête. Les 5 % d'erreurs
d'interprétation concernent des commandes ambiguës (« cars » seul) ou
hors-périmètre (calculs financiers).

## Citations marquantes

> « Agentic AI refers to a paradigm shift from quite passive tools to
> self-governing tools endowed with logic and the ability to make
> decisions and function in accordance with those. »

> « These function schemas will articulate sets of parameters expected
> from these functions to ensure data integrity when functioning
> autonomously. »

## Caveats — à lire avant de citer ce papier

- **Profil des auteurs** : étudiants undergraduate, papier unique. Pas
  d'expertise établie dans le domaine.
- **Venue** : [[iarjset]] annonce un « Impact Factor 8.311 » qui n'est
  pas un JCR — le journal n'est pas indexé dans Scopus ni Web of
  Science. La métrique est issue d'un calcul interne et n'est pas
  comparable aux facteurs d'impact des venues IEEE/ACM.
- **Méthodologie d'évaluation** : aucune baseline détaillée, jeu de
  500 « test cases » non décrit, pas de code public, pas de protocole
  reproductible. Les chiffres (60 %, 95 %, etc.) sont à traiter comme
  *self-reported* et non comme un benchmark.
- **Rédaction** : nombreuses formulations vagues et répétitives
  (« optimal management of resource contention », « efficient
  functioning »), évoquant une rédaction partiellement assistée par
  LLM.
- **Section Conclusion tronquée** dans le PDF : commence par « In this »
  sans complément. Probable erreur d'édition.

**Statut dans le wiki** : à traiter comme **illustration d'un pattern**
(function-calling pour CRUD piloté par LLM), pas comme source pour les
chiffres de performance.

## Connexions

- **Entités** : [[maharaja-institute-of-technology-mysore]], [[iarjset]],
  [[gemini-2-0-flash]], [[fastapi]], [[sqlite]]
- **Concepts** : [[agentic-ai]], [[function-calling]], [[fleet-management]]
- **Sources liées** : *(aucune pour l'instant — première source ingérée)*

## Pistes de suivi

- **Ingérer les deux surveys cités** comme sources de référence sur
  l'Agentic AI :
  - Abou Ali & Dornaika 2025, *Agentic AI: A Comprehensive Survey of
    Architectures, Applications, and Future Directions*, IEEE Xplore.
  - Acharya, Kuppan & Divya 2025, *Agentic AI: Autonomous Intelligence
    for Complex Goals — A Comprehensive Survey*, IEEE Access vol. 13.
- Documenter d'autres patterns d'implémentation pour comparaison :
  text-to-SQL, ReAct, multi-agent, MCP.
- Chercher des benchmarks rigoureux sur l'accuracy du function-calling
  de [[gemini-2-0-flash]] vs autres modèles.
- Croiser avec la doc officielle Google sur le function-calling.
