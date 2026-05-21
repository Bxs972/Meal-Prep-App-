---
type: concept
title: "Prompt RCORCF"
nature: methode
tags: [prompt-engineering, mnemotechnique, vulgarisation]
sources: ["[[2026-05-21-yes-we-prompt-30-competences-ia-2026]]"]
concepts_lies: []
---

# Prompt RCORCF

Méthode mnémotechnique de **prompt engineering** structurant une
requête à un LLM selon **6 piliers** :

| Lettre | Pilier | Question correspondante |
|--------|--------|-------------------------|
| **R** | Rôle | Qui doit agir, sous quel référentiel ? |
| **C** | Contexte | Pourquoi faut-il agir ? Quelle situation ? |
| **O** | Objectif | Quelle est la tâche précise à accomplir ? |
| **R** | Résultat | Quel livrable concret est attendu ? |
| **C** | Contraintes | Ce qu'il ne faut surtout pas faire (ton, longueur, style) |
| **F** | Format | Forme exacte de la réponse (tableau, code, liste, markdown) |

L'idée centrale : un prompt non structuré laisse trop de degrés de
liberté au modèle (probabiliste), ce qui dégrade la reproductibilité
des résultats. Imposer une structure réduit la variance.

## Positionnement

Le RCORCF est une **variante française** d'une famille de
mnémotechniques équivalentes apparues dans la littérature de prompt
engineering :

- **CRISPE** (Capacity/Role, Insight, Statement, Personality, Experiment)
- **RACE** (Role, Action, Context, Expectations)
- **CO-STAR** (Context, Objective, Style, Tone, Audience, Response)
- **CLEAR** (Concise, Logical, Explicit, Adaptive, Reflective)

Toutes partagent le même squelette : forcer l'utilisateur à expliciter
le rôle, le contexte, l'objectif et le format avant d'écrire le corps
du prompt.

**Posture wiki** : aide-mémoire utile pour les débutants, **pas une
méthode unique ni « officielle »**. La source qui le présente
([[yes-we-prompt]]) le qualifie de « standard industriel » — qualificatif
non étayé par une institution.

## Sources

- [[2026-05-21-yes-we-prompt-30-competences-ia-2026]] — présentation et
  argumentaire.

## Voir aussi

- [[function-calling]] — mécanisme complémentaire : pour structurer la
  *sortie* du LLM (vs RCORCF qui structure l'*entrée*).
- *(à comparer plus tard avec : CRISPE, RACE, CO-STAR, CLEAR — pages
  à créer si des sources comparatives surgissent.)*
