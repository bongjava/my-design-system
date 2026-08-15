import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const tokensPath = resolve(root, "tokens/tokens.json");

const tokens = JSON.parse(await readFile(tokensPath, "utf8"));

function value(path) {
  return path.split(".").reduce((node, key) => node[key], tokens).$value;
}

function hexToInt(hex) {
  return `0xFF${hex.replace("#", "").toUpperCase()}`;
}

function hexToSwiftColor(hex) {
  const [r, g, b] = hex.replace("#", "").match(/.{2}/g).map((part) => parseInt(part, 16));
  return `Color(red: ${r} / 255, green: ${g} / 255, blue: ${b} / 255)`;
}

const generated = new Map([
  [
    "packages/react/tokens.css",
    `:root {
  --ds-color-brand-primary: ${value("color.brand.primary")};
  --ds-color-brand-secondary: ${value("color.brand.secondary")};
  --ds-color-brand-accent: ${value("color.brand.accent")};
  --ds-color-surface-page: ${value("color.surface.page")};
  --ds-color-surface-panel: ${value("color.surface.panel")};
  --ds-color-surface-text: ${value("color.surface.text")};
  --ds-space-xs: ${value("space.xs")};
  --ds-space-sm: ${value("space.sm")};
  --ds-space-md: ${value("space.md")};
  --ds-space-lg: ${value("space.lg")};
  --ds-radius-sm: ${value("radius.sm")};
  --ds-radius-md: ${value("radius.md")};
}
`
  ],
  [
    "packages/react/index.ts",
    `export const tokens = {
  colorBrandPrimary: "${value("color.brand.primary")}",
  colorBrandSecondary: "${value("color.brand.secondary")}",
  colorBrandAccent: "${value("color.brand.accent")}",
  radiusMd: "${value("radius.md")}"
} as const;

export type ButtonTone = "primary" | "secondary";
`
  ],
  [
    "packages/flutter/lib/my_design_system.dart",
    `class MyDesignTokens {
  static const colorBrandPrimary = ${hexToInt(value("color.brand.primary"))};
  static const colorBrandSecondary = ${hexToInt(value("color.brand.secondary"))};
  static const colorBrandAccent = ${hexToInt(value("color.brand.accent"))};
  static const radiusMd = 8.0;
}
`
  ],
  [
    "packages/compose/src/commonMain/kotlin/com/bongjava/designsystem/Tokens.kt",
    `package com.bongjava.designsystem

object MyDesignTokens {
    const val ColorBrandPrimary = ${hexToInt(value("color.brand.primary"))}
    const val ColorBrandSecondary = ${hexToInt(value("color.brand.secondary"))}
    const val ColorBrandAccent = ${hexToInt(value("color.brand.accent"))}
    const val RadiusMd = 8
}
`
  ],
  [
    "packages/swiftui/Sources/MyDesignSystem/Tokens.swift",
    `import SwiftUI

public enum MyDesignTokens {
    public static let colorBrandPrimary = ${hexToSwiftColor(value("color.brand.primary"))}
    public static let colorBrandSecondary = ${hexToSwiftColor(value("color.brand.secondary"))}
    public static let colorBrandAccent = ${hexToSwiftColor(value("color.brand.accent"))}
    public static let radiusMd: CGFloat = 8
}
`
  ]
]);

let hasMismatch = false;

for (const [relativePath, expected] of generated) {
  const target = resolve(root, relativePath);
  const current = await readFile(target, "utf8").catch(() => "");
  if (current !== expected) {
    if (checkOnly) {
      console.error(`Generated token output is stale: ${relativePath}`);
      hasMismatch = true;
    } else {
      await writeFile(target, expected);
      console.log(`Wrote ${relativePath}`);
    }
  }
}

if (hasMismatch) {
  process.exitCode = 1;
}
