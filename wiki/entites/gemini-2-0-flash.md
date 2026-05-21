---
type: entite
title: "Gemini 2.0 Flash"
categorie: outil
role: "modèle de langage (Google DeepMind)"
tags: [llm, google, function-calling]
sources: ["[[2026-05-18-agentic-ai-fleet-management]]"]
---

# Gemini 2.0 Flash

Modèle de langage de Google DeepMind, branche **Flash** de la famille
Gemini 2.0 — optimisée pour la latence et le coût plutôt que pour la
profondeur de raisonnement. Supporte le **[[function-calling]]**
structuré : le modèle reçoit un catalogue de fonctions (schémas JSON
avec paramètres typés) et peut décider d'en appeler une plutôt que de
répondre en texte libre.

## Usages observés dans le wiki

- Pilote conversationnel d'un système CRUD sur inventaire automobile
  via function-calling — voir [[2026-05-18-agentic-ai-fleet-management]].

## Caractéristiques techniques (à compléter)

- **Mode de sortie** : texte libre ou appel de fonction structuré.
- **Latence observée** dans le papier ingéré : 3-5 s par requête NLP
  (à recouper avec d'autres sources et benchmarks officiels).

## Sources

- [[2026-05-18-agentic-ai-fleet-management]]

## Voir aussi

- [[function-calling]]
- [[agentic-ai]]
- *(à venir : documentation officielle Google sur Gemini.)*
