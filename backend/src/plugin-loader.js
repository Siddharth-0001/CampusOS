/**
 * Plugin Loader System
 * Dynamically discovers and loads modules from /apps/ directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadPlugins(app, registry) {
  const appsDir = path.join(__dirname, '../../..', 'apps');

  if (!fs.existsSync(appsDir)) {
    console.warn('⚠️  /apps directory not found. No plugins loaded.');
    return;
  }

  const modules = fs.readdirSync(appsDir);
  console.log(`\n📦 Loading ${modules.length} plugin(s)...\n`);

  for (const moduleName of modules) {
    const modulePath = path.join(appsDir, moduleName);
    const stat = fs.statSync(modulePath);

    // Skip non-directories
    if (!stat.isDirectory()) continue;

    // Check if module has src/index.js
    const moduleIndexPath = path.join(modulePath, 'src', 'index.js');
    
    if (!fs.existsSync(moduleIndexPath)) {
      console.warn(
        `⚠️  Skipped ${moduleName}: no src/index.js entry point found`
      );
      continue;
    }

    try {
      // Dynamically import the module
      const module = await import(`file://${moduleIndexPath}`);
      const init = module.default || module.init;

      if (typeof init !== 'function') {
        throw new Error(
          `Module must export a default function or named 'init' function`
        );
      }

      // Initialize the module, passing Express app and registry
      await init(app, registry);

      console.log(`✓ Loaded plugin: ${moduleName}`);
    } catch (error) {
      console.error(
        `✗ Failed to load plugin ${moduleName}:`,
        error.message
      );
      // Don't block other modules from loading
    }
  }

  console.log('\n✓ Plugin loading complete\n');
}

export default loadPlugins;
