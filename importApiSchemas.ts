import { execFileSync } from 'child_process';
import { writeFileSync } from 'fs';
import { importedConfig } from './importConfig';
import JsonToTS from 'json-to-ts';

import os from 'os';
import path from 'path';

for (const key in importedConfig.apiSchemaPaths) {
  const relativeSchemaPath = path.relative(
    process.cwd(),
    importedConfig.apiSchemaPaths[key]
  );

  const cliSchemaPath = relativeSchemaPath.split(path.sep).join('/');

  const outputPath = `./src/${key}_api_schema_client.d.ts`;
  const command = 'npx';
  const args = ['openapi-typescript', cliSchemaPath, '-o', outputPath];

  try {
    execFileSync(command, args, {
      stdio: 'inherit',
      shell: os.platform() === 'win32', // Use shell on Windows
    });
  } catch (err) {
    console.error('Failed to generate openapi types:', err);
    process.exit(1);
  }

  // Convert key from snake_case or underscore_separated to CapitalCamelCase
  const toCapitalCamelCase = (str: string) =>
    str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

  const camelKey = toCapitalCamelCase(key);

  const lines = JsonToTS(importedConfig.apiSchemas[key], {
    rootName: `${camelKey}ApiSchema`,
  });

  lines[0] = 'export ' + lines[0]; // Ensure the first line is exported
  const typesOutputPath = `./src/${key}_api_schema.d.ts`;
  writeFileSync(typesOutputPath, lines.join('\n'), 'utf8');
}
