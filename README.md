# My Design System

This repository is the independent source of truth for the personal design system. The Personal Development Harness references this repository by version; it does not copy these token sources.

## Responsibilities

- Own Design Tokens in `tokens/tokens.json`.
- Generate platform packages from the same token version.
- Release stable versions with semver tags such as `v1.0.0`.
- Publish package artifacts for React/Next.js, Flutter, Compose, and SwiftUI.

## Layout

```text
my-design-system/
|-- tokens/
|   `-- tokens.json
|-- packages/
|   |-- react/
|   |-- flutter/
|   |-- compose/
|   `-- swiftui/
`-- examples/
```

## Versioning

Use semver:

- Patch: compatible token value fixes or package bug fixes.
- Minor: new tokens/components without breaking existing consumers.
- Major: renamed/removed tokens, incompatible component API changes, or visual changes that require migration.

Each release tag should point to a commit where tokens and all platform packages agree on the same version.
