import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

export function loadObjectFromFile(configPath: string): Record<string, any> {
  const ext = path.extname(configPath).toLowerCase();

  switch (ext) {
    case '.json':
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    case '.yaml':
    case '.yml':
      return yaml.load(fs.readFileSync(configPath, 'utf8')) as Record<
        string,
        any
      >;
    case '.ini':
      return ini.parse(fs.readFileSync(configPath, 'utf8'));
    default:
      throw new Error(
        `Config file ${configPath} has an unsupported extension. Supported extensions are .json, .yaml, .yml, .ini`
      );
  }
}

export function convertPathToAbsolute(rootDir: string, a: string): string {
  if (path.isAbsolute(a)) {
    return a;
  } else {
    return path.resolve(rootDir, a);
  }
}
