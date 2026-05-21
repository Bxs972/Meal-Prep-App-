---
type: entite
title: "SQLite"
categorie: outil
role: "moteur de base de données relationnelle embarqué"
tags: [base-de-donnees, sql, embarque]
sources: ["[[2026-05-18-agentic-ai-fleet-management]]"]
---

# SQLite

Moteur de base de données relationnelle embarqué (single-file, sans
serveur). Largement utilisé pour les prototypes, applications desktop
et mobiles. Transactions ACID. Souvent piloté en Python via
**SQLAlchemy** (ORM) pour bénéficier d'un mapping objet-relationnel
indépendant du moteur.

## Usages observés dans le wiki

- Backend de stockage d'un inventaire automobile dans une preuve de
  concept agentic, accédé via SQLAlchemy ORM — voir
  [[2026-05-18-agentic-ai-fleet-management]].

## À noter

- **SQLAlchemy** n'a pas (encore) sa propre page : il est mentionné ici
  car la combinaison SQLite + SQLAlchemy revient ensemble. À éclater en
  page dédiée si SQLAlchemy apparaît dans plusieurs sources.

## Sources

- [[2026-05-18-agentic-ai-fleet-management]]

## Voir aussi

- [[fastapi]]
