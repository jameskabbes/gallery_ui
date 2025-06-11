import { writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { importedConfig } from './importConfig';
import JsonToTS from 'json-to-ts';

import os from 'os';
import path from 'path';

const relativeOpenapiSchemaPath = path.relative(
  process.cwd(),
  importedConfig.openapiSchemaPath
);

const cliSchemaPath = relativeOpenapiSchemaPath.split(path.sep).join('/');

const outputPath = './src/openapi_schema.d.ts';
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

const lines = JsonToTS(importedConfig.openapiSchema, {
  rootName: 'OpenapiSchema',
});

lines[0] = 'export ' + lines[0]; // Ensure the first line is exported
const typesOutputPath = './src/openapi_schema.d.ts';
writeFileSync(typesOutputPath, lines.join('\n'), 'utf8');
