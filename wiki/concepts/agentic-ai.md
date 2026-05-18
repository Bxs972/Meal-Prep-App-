---
type: concept
title: "Agentic AI"
nature: idee
tags: [llm, agents, autonomie]
sources: ["[[2026-05-18-agentic-ai-fleet-management]]"]
concepts_lies: ["[[function-calling]]"]
---

# Agentic AI

Paradigme dans lequel un système d'IA (typiquement bâti autour d'un
LLM) ne se contente pas de produire des réponses textuelles, mais
**prend des décisions, choisit des actions et les exécute** dans un
environnement, en poursuivant un objectif sur plusieurs étapes.

Distinction couramment faite dans la littérature (reprise dans
[[2026-05-18-agentic-ai-fleet-management]], non encore croisée avec les
surveys de fond) :

- **AI Agent** = un système autonome unique.
- **Agentic AI** = orchestration de plusieurs agents ou capacités, avec
  un comportement émergent.

## Briques techniques typiques

- **LLM** comme moteur de compréhension et de planification.
- **Tool-use / [[function-calling]]** comme interface avec le monde
  (DB, APIs, OS).
- **Mémoire de session** pour préserver le contexte multi-tours.
- **Validation** des actions avant exécution (contraintes de schéma,
  garde-fous métier).

## Définitions rencontrées dans le wiki

> « Agentic AI refers to a paradigm shift from quite passive tools to
> self-governing tools endowed with logic and the ability to make
> decisions and function in accordance with those. »
> — [[2026-05-18-agentic-ai-fleet-management]]

*(à enrichir avec les surveys Abou Ali & Dornaika 2025 et Acharya
et al. 2025 — sources à ingérer.)*

## Implémentations observées dans le wiki

- CRUD sur inventaire automobile via [[gemini-2-0-flash]] + function
  schemas — voir [[2026-05-18-agentic-ai-fleet-management]].

## Sources

- [[2026-05-18-agentic-ai-fleet-management]]

## Voir aussi

- [[function-calling]]
- [[fleet-management]] — un domaine d'application
- [[gemini-2-0-flash]]
