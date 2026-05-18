---
type: concept
title: "Function-calling"
nature: methode
tags: [llm, tool-use, agents]
sources: ["[[2026-05-18-agentic-ai-fleet-management]]"]
concepts_lies: ["[[agentic-ai]]"]
---

# Function-calling

Mécanisme par lequel un LLM, au lieu de produire du texte libre, **émet
un appel structuré à une fonction définie côté application**, en
remplissant les paramètres conformément à un schéma fourni dans le
prompt.

C'est le pattern technique central derrière la plupart des
architectures [[agentic-ai]] modernes : il sépare proprement *la
compréhension du langage* (responsabilité du LLM) de *l'exécution
effective* (responsabilité du code applicatif).

## Composants

1. **Catalogue de function schemas** déclaré côté application : nom de
   fonction, description, paramètres (nom, type, contraintes).
2. **Prompt injecté avec ce catalogue** au LLM, en plus du message
   utilisateur et de l'historique.
3. **Sortie structurée** du LLM : soit une réponse en texte, soit un
   objet `{function_name, arguments}`.
4. **Couche de validation et de dispatch** côté application : valider
   les arguments contre le schéma, exécuter la fonction Python/JS
   correspondante, renvoyer le résultat au LLM pour génération de la
   réponse finale.

## Pourquoi c'est utile

- **Sécurité / intégrité des données** : la fonction valide ses propres
  arguments avant de toucher la base. Le LLM ne génère pas de SQL — il
  remplit des paramètres typés.
- **Composabilité** : ajouter une capacité = déclarer une nouvelle
  fonction et son schéma.
- **Auditabilité** : on logge des appels structurés, pas des chaînes
  de texte ambiguës.

## Implémentations observées dans le wiki

- [[gemini-2-0-flash]] expose un mécanisme natif de function-calling,
  utilisé pour piloter un CRUD [[sqlite]] via [[fastapi]] — voir
  [[2026-05-18-agentic-ai-fleet-management]].

## Sources

- [[2026-05-18-agentic-ai-fleet-management]]

## Voir aussi

- [[agentic-ai]]
- [[gemini-2-0-flash]]
- *(à comparer plus tard avec : text-to-SQL, ReAct, JSON mode strict,
  MCP — pages à créer.)*
