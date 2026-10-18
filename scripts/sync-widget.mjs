#!/usr/bin/env node
// Copies the shared iOS day widget into an app's widget extension.
//
// Run it FROM an app directory, naming the extension's folder (the one Xcode
// created with the Widget Extension target, beside `ios/App/App`):
//   "widget:copy": "node ../nuxt-ionic/scripts/sync-widget.mjs ios/App/LoveWell"
//
// The Swift is identical in every app — per-app values live in the widget's
// Info.plist, its asset catalog and the payload (see native/ios/DayWidget.swift)
// — so this is a plain overwrite. Never edit the app's copy.
//
// Pure `node:fs`, like sync-supabase.mjs.

import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, '../native/ios/DayWidget.swift');
const target = process.argv[2];

if (!target) {
  console.error('usage: sync-widget.mjs <widget-extension-folder>   e.g. ios/App/LoveWell');
  process.exit(1);
}

const dest = resolve(process.cwd(), target);
if (!existsSync(join(dest, 'Info.plist'))) {
  console.error(`${target} has no Info.plist — is it the widget extension's folder?`);
  process.exit(1);
}

// A second `@main` in the folder (Xcode's template bundle, or an older copy
// under another name) fails the build with a confusing duplicate-entry error.
const strays = readdirSync(dest)
  .filter(f => f.endsWith('.swift') && f !== 'DayWidget.swift');
if (strays.length) {
  console.warn(`warning: ${target} also holds ${strays.join(', ')} — remove any that declare @main.`);
}

copyFileSync(source, join(dest, 'DayWidget.swift'));
console.log(`copied DayWidget.swift → ${target}`);
