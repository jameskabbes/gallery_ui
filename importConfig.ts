import {
  Config,
  GeneratedSharedConfig,
  FrontendConfig,
  EnvVar,
  EnvVarMapping,
} from './src/types';
import { GalleryApiSchema } from './src/types/gallery/api_schema';

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import yaml, { load } from 'js-yaml';
import os from 'os';
import { warn } from 'console';
import dotenv from 'dotenv';
import { convertPathToAbsolute, loadObjectFromFile } from './src/utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envVarMapping: EnvVarMapping = {
  env: 'ARBOR_IMAGO_ENV',
  configDir: 'ARBOR_IMAGO_CONFIG_DIR',
  envPath: 'ARBOR_IMAGO_ENV_PATH',
  frontendConfigPath: 'ARBOR_IMAGO_FRONTEND_CONFIG_PATH',
  generatedSharedConfigPath: 'ARBOR_IMAGO_GENERATED_SHARED_CONFIG_PATH',
};

const envEnv = process.env.ARBOR_IMAGO_ENV;
const envConfigDir = process.env.ARBOR_IMAGO_CONFIG_DIR;
const envEnvPath = process.env.ARBOR_IMAGO_ENV_PATH;
const envFrontendConfigPath = process.env.ARBOR_IMAGO_FRONTEND_CONFIG_PATH;
const envGeneratedSharedConfigPath =
  process.env.ARBOR_IMAGO_GENERATED_SHARED_CONFIG_PATH;

const appName = 'arbor_imago';

function userConfigDir(appName: string): string {
  const home = os.homedir();
  const platform = os.platform();

  if (platform === 'win32') {
    const appData =
      process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    return path.join(appData, appName);
  } else if (platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', appName);
  } else {
    return path.join(home, '.config', appName);
  }
}

// ENV
let env = envEnv === undefined ? 'local' : envEnv;

// CONFIG_DIR
let configDir =
  envConfigDir === undefined
    ? path.join(userConfigDir(appName), env)
    : convertPathToAbsolute(process.cwd(), envConfigDir);

// ENV_PATH
const envPath =
  envEnvPath === undefined
    ? path.join(configDir, '.env')
    : convertPathToAbsolute(process.cwd(), envEnvPath);

const dotenv_values = dotenv.config({ path: envPath }); // Load environment variables from .env file

if (dotenv_values.parsed !== undefined) {
  // prohibit settings .env path variable
  if (envVarMapping['envPath'] in dotenv_values.parsed) {
    throw new Error(
      `Setting environment variable ${envVarMapping['envPath']} in .env file is not supported. Remove it from the file ${envPath} `
    );
  }

  // when to prohibit setting env from the .env file?
  const _env = dotenv_values.parsed[envVarMapping['env']];
  if (_env !== undefined) {
    function _raise() {
      throw new Error(
        `Mismatched environment variable ${envVarMapping['env']} values provided as 1) environment variable and 2) in the env file ${envPath}`
      );
    }
    if (envEnv !== undefined && envEnv !== _env) {
      _raise();
    }

    if (
      envEnv === undefined &&
      envConfigDir === undefined &&
      envEnvPath === undefined
    ) {
      _raise();
    }
    env = _env;
  }

  // when to prohibit settings configDir from the .env file?
  const _configDir = dotenv_values.parsed[envVarMapping['configDir']];
  if (_configDir !== undefined) {
    function _raise() {
      throw new Error(
        `Mismatched environment variable ${envVarMapping['configDir']} values provided as 1) environment variable and 2) in the env file ${envPath}`
      );
    }
    if (envConfigDir !== undefined && envConfigDir !== _configDir) {
      _raise();
    }

    if (
      envConfigDir === undefined &&
      envEnv === undefined &&
      envEnvPath === undefined
    ) {
      _raise();
    }
    configDir = convertPathToAbsolute(process.cwd(), _configDir);
  }
}

const frontendConfigPath =
  envFrontendConfigPath === undefined
    ? path.join(configDir, 'frontend.json')
    : convertPathToAbsolute(process.cwd(), envFrontendConfigPath);

const generatedSharedConfigPath =
  envGeneratedSharedConfigPath === undefined
    ? path.join(configDir, 'shared.json')
    : convertPathToAbsolute(process.cwd(), envGeneratedSharedConfigPath);

const frontendConfig = loadObjectFromFile(frontendConfigPath) as FrontendConfig;
const generatedSharedConfig = loadObjectFromFile(
  generatedSharedConfigPath
) as GeneratedSharedConfig;

// now make sure the shared env matches
if (generatedSharedConfig.ENV !== env) {
  throw new Error(
    `Mismatched environment variable ${envVarMapping['env']} values provided as 1) environment variable and 2) in the generated_shared config file ${generatedSharedConfigPath}. `
  );
}

let apiSchemaPaths: Config['apiSchemaPaths'] = {
  gallery: '../gallery_api_schema.json',
};

apiSchemaPaths = {
  ...apiSchemaPaths,
  ...(frontendConfig.OPENAPI_SCHEMA_PATHS ?? {}),
};

// Convert all values to absolute paths
apiSchemaPaths = Object.fromEntries(
  Object.entries(apiSchemaPaths).map(([key, value]) => [
    key,
    convertPathToAbsolute(process.cwd(), value),
  ])
) as Config['apiSchemaPaths'];

let apiSchemas: Config['apiSchemas'] = {
  gallery: loadObjectFromFile(apiSchemaPaths['gallery']) as GalleryApiSchema,
};

// vite
let vite: Config['vite'] = {
  server: {},
};

export const importedConfig: Config = {
  env: env,
  backendUrl: generatedSharedConfig.BACKEND_URL,
  frontendUrl: generatedSharedConfig.FRONTEND_URL,
  vite: vite,
  apiSchemaPaths,
  apiSchemas,
  authKey: generatedSharedConfig.AUTH_KEY,
  headerKeys: generatedSharedConfig.HEADER_KEYS,
  frontendRoutes: generatedSharedConfig.FRONTEND_ROUTES,
  scopeNameMapping: generatedSharedConfig.SCOPE_NAME_MAPPING,
  scopeIdMapping: Object.entries(
    generatedSharedConfig.SCOPE_NAME_MAPPING
  ).reduce((acc: Config['scopeIdMapping'], [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as {}),
  visibilityLevelNameMapping:
    generatedSharedConfig.VISIBILITY_LEVEL_NAME_MAPPING,
  visibilityLevelIdMapping: Object.entries(
    generatedSharedConfig.VISIBILITY_LEVEL_NAME_MAPPING
  ).reduce((acc: Config['visibilityLevelIdMapping'], [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as {}),
  permissionLevelNameMapping:
    generatedSharedConfig.PERMISSION_LEVEL_NAME_MAPPING,
  permissionLevelIdMapping: Object.entries(
    generatedSharedConfig.PERMISSION_LEVEL_NAME_MAPPING
  ).reduce((acc: Config['permissionLevelIdMapping'], [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as {}),
  userRoleNameMapping: generatedSharedConfig.USER_ROLE_NAME_MAPPING,
  userRoleIdMapping: Object.entries(
    generatedSharedConfig.USER_ROLE_NAME_MAPPING
  ).reduce((acc: Config['userRoleIdMapping'], [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as {}),
  userRoleScopes: Object.fromEntries(
    Object.entries(generatedSharedConfig.USER_ROLE_SCOPES).map(([key, arr]) => [
      key,
      new Set(arr),
    ])
  ) as Config['userRoleScopes'],
  otpLength: generatedSharedConfig.OTP_LENGTH,
  googleClientId: generatedSharedConfig.GOOGLE_CLIENT_ID,
};
