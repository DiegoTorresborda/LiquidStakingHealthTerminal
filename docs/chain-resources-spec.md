# Chain Resources Feature

## Purpose

This feature provides a curated registry of relevant links for each tracked chain.

The goal is to make the dashboard operationally useful for:
- research
- business development
- proposal writing
- ecosystem analysis

## Supported resource types

Each chain may include links for:
- website
- technical docs
- explorer
- staking page
- governance
- github
- ecosystem page
- analytics tools
- community

## Data model

Chain resources must be stored in a structured external file.

Preferred location:
- /data/chain-resources.json

Preferred schema:
- label
- url
- category
- priority
- optional description

## Categories

Supported categories:
- official
- docs
- explorer
- staking
- governance
- developer
- ecosystem
- analytics
- community

## UI requirements

The feature should appear in:
- the overview dashboard as a quick action
- the network detail page as a dedicated section

Links should be grouped by category and sorted by priority.

## v1 scope

This is a curated registry only.
Do not implement automatic link discovery or web crawling in v1.
