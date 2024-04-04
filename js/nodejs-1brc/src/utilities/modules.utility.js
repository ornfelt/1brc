import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export function is_main_module(meta) {
  const main_module_path = fs.realpathSync(process.argv[1]);
  const current_module_path = fileURLToPath(meta.url);
  return main_module_path === current_module_path;
}

export function is_secondary_module(meta) {
  return !is_main_module(meta);
}
