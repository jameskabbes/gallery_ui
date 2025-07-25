import React from 'react';
import {
  paths as GalleryApiClientPaths,
  operations,
  components,
} from './types/gallery/api_schema_client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { E164Number } from 'libphonenumber-js';
import { GalleryApiSchema } from './types/gallery/api_schema';

import {
  ClientRequestMethod,
  MaybeOptionalInit,
  FetchResponse,
} from 'openapi-fetch';
import { RequiredKeysOf } from 'openapi-typescript-helpers';

import {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from 'openapi-typescript-helpers';

export type PossibleApiSchemaClientPaths = GalleryApiClientPaths;
export type PossibleApiSchema = GalleryApiSchema;

export type ElementType<T> = T extends readonly (infer U)[] ? U : never;

// Helper type to check if a property exists and is the right type
export type HasNumericProperty<T, K extends string> = K extends keyof T
  ? T[K] extends number
    ? T[K]
    : never
  : never;

// Conditional interface that only includes properties that exist in the schema
export type NumericQueryParamSchema<T> = T & {
  [K in 'default' | 'minimum' | 'maximum']: K extends keyof T
    ? T[K] extends number
      ? T[K] // Keep as required if it exists and is a number
      : never
    : never;
} extends infer U
  ? { [K in keyof U as U[K] extends never ? never : K]: U[K] }
  : never;

export type MyInitParam<Init> = RequiredKeysOf<Init> extends never
  ? [(Init & { [key: string]: unknown })?]
  : [Init & { [key: string]: unknown }];

// Helper type that works with both required and optional keys
type SafeKeys<T, K extends string> =
  // Match both { key: value } and { key?: value } patterns
  T extends { [P in K]?: infer U }
    ? keyof U extends never
      ? never
      : Record<keyof U & string, any>
    : never;

// Helper type for parameter schema mapping
type ParameterTypeHelper<TParams, TKey extends string, TValueType> = SafeKeys<
  TParams,
  TKey
> extends never
  ? never
  : Record<
      keyof (TParams extends { [P in TKey]?: infer R } ? R : {}),
      TValueType
    >;

export type ApiSchemaClientParametersByType<TApiSchemaClientOperation> =
  // Check if 'parameters' exists as a key
  'parameters' extends keyof TApiSchemaClientOperation
    ? // Then check if the parameters object has the expected structure
      TApiSchemaClientOperation['parameters'] extends {
        query?: any;
        path?: any;
        cookie?: any;
        header?: any;
      }
      ? TApiSchemaClientOperation['parameters']
      : never
    : never;

export type ApiSchemaParametersByType<
  TApiSchemaClientParametersByType extends {
    query?: TApiSchemaClientQuery;
    path?: TApiSchemaClientPath;
    cookie?: TApiSchemaClientCookie;
    header?: TApiSchemaClientHeader;
  },
  TApiSchemaParameter
> = {
  query: ParameterTypeHelper<
    TApiSchemaClientParametersByType,
    'query',
    TApiSchemaParameter
  >;
  path: ParameterTypeHelper<
    TApiSchemaClientParametersByType,
    'path',
    TApiSchemaParameter
  >;
  cookie: ParameterTypeHelper<
    TApiSchemaClientParametersByType,
    'cookie',
    TApiSchemaParameter
  >;
  header: ParameterTypeHelper<
    TApiSchemaClientParametersByType,
    'header',
    TApiSchemaParameter
  >;
};

export type ApiSchemaParameter<TApiSchema, TPath, TMethod> =
  TApiSchema extends {
    paths: Record<
      TPath,
      Record<TMethod, { parameters: infer P extends any[] }>
    >;
  }
    ? GetElementTypeFromArray<P>
    : never;

export interface ApiService<
  TApiSchemaClientPaths,
  TApiSchema,
  TMethod extends HttpMethod &
    keyof TApiSchemaClientPaths[TPath] &
    keyof TApiSchema['paths'][TPath],
  TPath extends PathsWithMethod<TApiSchemaClientPaths, TMethod> &
    keyof TApiSchemaClientPaths &
    keyof TApiSchema['paths'],
  TMediaType extends MediaType = `${string}/${string}`,
  TInit extends MaybeOptionalInit<
    TApiSchemaClientPaths[TPath],
    TMethod
  > = MaybeOptionalInit<TApiSchemaClientPaths[TPath], TMethod>,
  TApiSchemaClientOperation = TApiSchemaClientPaths[TPath][TMethod],
  TApiSchemaParameter = ApiSchemaParameter<TApiSchema, TPath, TMethod>
> {
  url: TPath;
  method: TMethod;
  apiSchemaClientOperation: TApiSchemaClientOperation;
  apiSchemaParameter: TApiSchemaParameter;
  apiSchemaParameterSchemasByType: ApiSchemaParametersByType<
    ApiSchemaClientParametersByType<TApiSchemaClientOperation>,
    TApiSchemaParameter
  >;
  apiSchemaClientParametersByType: TApiSchemaClientOperation['parameters'];
  request: (
    ...init: MyInitParam<TInit>
  ) => Promise<
    FetchResponse<
      TApiSchemaClientOperation & Record<string, any>,
      TInit,
      TMediaType
    >
  >;
}

export type GetElementTypeFromArray<T extends any[]> = T extends (infer U)[]
  ? U
  : never;

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface ValidatedInputState<T> {
  value: T;
  status: 'valid' | 'invalid' | 'loading';
  error: string | null;
}

export interface DarkModeContextType {
  state: boolean;
  systemState: boolean;
  preference: 'light' | 'dark' | 'system';
  setPreference: (preference: 'light' | 'dark' | 'system') => void;
}

export type AuthModalType =
  | 'logIn'
  | 'requestSignUp'
  | 'requestMagicLink'
  | 'requestOTP'
  | 'verifyOTP';

export interface AuthModalsContextType {
  activate: (modal: AuthModalType | null) => void;
}

export interface LogInContextType {
  username: ValidatedInputState<string>;
  setUsername: React.Dispatch<
    React.SetStateAction<LogInContextType['username']>
  >;
  password: ValidatedInputState<string>;
  setPassword: React.Dispatch<
    React.SetStateAction<LogInContextType['password']>
  >;
  staySignedIn: ValidatedInputState<boolean>;
  setStaySignedIn: React.Dispatch<
    React.SetStateAction<LogInContextType['staySignedIn']>
  >;
  valid: boolean;
  setValid: React.Dispatch<React.SetStateAction<LogInContextType['valid']>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<LogInContextType['loading']>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<LogInContextType['error']>>;
}

export interface RequestSignUpContextType {
  email: ValidatedInputState<string>;
  setEmail: React.Dispatch<
    React.SetStateAction<RequestSignUpContextType['email']>
  >;
  valid: boolean;
  setValid: React.Dispatch<
    React.SetStateAction<RequestSignUpContextType['valid']>
  >;
  loading: boolean;
  setLoading: React.Dispatch<
    React.SetStateAction<RequestSignUpContextType['loading']>
  >;
}

export interface RequestMagicLinkContextType {
  medium: 'email' | 'sms';
  setMedium: React.Dispatch<
    React.SetStateAction<RequestMagicLinkContextType['medium']>
  >;
  email: ValidatedInputState<string>;
  setEmail: React.Dispatch<
    React.SetStateAction<RequestMagicLinkContextType['email']>
  >;
  phoneNumber: ValidatedInputState<E164Number>;
  setPhoneNumber: React.Dispatch<
    React.SetStateAction<RequestMagicLinkContextType['phoneNumber']>
  >;
  valid: boolean;
  setValid: React.Dispatch<
    React.SetStateAction<RequestMagicLinkContextType['valid']>
  >;
  loading: boolean;
  setLoading: React.Dispatch<
    React.SetStateAction<RequestMagicLinkContextType['loading']>
  >;
}

export interface RequestOTPContextType {
  medium: 'email' | 'sms';
  setMedium: React.Dispatch<
    React.SetStateAction<RequestOTPContextType['medium']>
  >;
  email: ValidatedInputState<string>;
  setEmail: React.Dispatch<
    React.SetStateAction<RequestOTPContextType['email']>
  >;
  phoneNumber: ValidatedInputState<E164Number>;
  setPhoneNumber: React.Dispatch<
    React.SetStateAction<RequestOTPContextType['phoneNumber']>
  >;
  valid: boolean;
  setValid: React.Dispatch<
    React.SetStateAction<RequestOTPContextType['valid']>
  >;
}

export interface ModalType<T = Record<string, any>> {
  key: string;
  Component: React.ComponentType<any>;
  componentProps?: T;
  contentAdditionalClassName?: string;
  includeExitButton?: boolean;
  onExit?: () => void;
}

export type ModalUpdateType<T = Record<string, any>> = Partial<
  Omit<ModalType<Partial<T>>, 'key'>
> &
  Pick<ModalType<T>, 'key'>;

export interface ModalsContextType {
  activeModal: ModalType | null;
  pushModals: (modals: ModalType[]) => void;
  deleteModals: (modalKeys: ModalType['key'][]) => void;
  updateModals: (modals: ModalUpdateType[]) => void;
  upsertModals: (modals: ModalType[]) => void;
  swapActiveModal: (modal: ModalType) => void;
}

export interface DeviceContextType {
  isMobile: boolean;
}

export interface DataContextType {
  studios: null;
}

export type ToastId = string;

export interface ToastType {
  type: 'error' | 'info' | 'success' | 'pending';
  message: string;
}

export interface ToastNoType extends Omit<ToastType, 'type'> {}

export interface ToastContextState {
  toasts: Map<ToastId, ToastType>;
}

export interface ToastReducerActionTypes {
  ADD: {
    type: 'ADD';
    payload: {
      id: ToastId;
      toast: ToastType;
    };
  };
  REMOVE: {
    type: 'REMOVE';
    payload: string;
  };
  UPDATE: {
    type: 'UPDATE';
    payload: {
      id: ToastId;
      toast: Partial<ToastType>;
    };
  };
  CLEAR: {
    type: 'CLEAR';
  };
}

export type ToastReducerAction =
  ToastReducerActionTypes[keyof ToastReducerActionTypes];

export interface ToastContextType {
  state: ToastContextState;
  dispatch: React.Dispatch<ToastReducerAction>;
  make: (toast: ToastType) => ToastId;
  makePending: (toast: ToastNoType) => ToastId;
  update: (id: ToastId, toast: Partial<ToastType>) => void;
}

export type AuthContextState =
  components['schemas']['GetUserSessionInfoReturn'];

export interface AuthContextType {
  state: AuthContextState;
  setState: React.Dispatch<React.SetStateAction<AuthContextState>>;
  logOut: (toastId?: ToastId) => void;
  updateFromApiResponse: (data: any) => void;
}

export interface EscapeKeyContextType {
  addCallback: (callback: () => void) => void;
  removeCallback: (callback: () => void) => void;
}

export interface SurfaceContextType {
  level: number;
  mode: 'a' | 'b';
}

export type OrderByState = 'off' | 'asc' | 'desc';

interface HeaderKeys {
  auth_logout: string;
}

export type ScopeName = string;
export type ScopeId = number;
export type VisibilityLevelName = string;
export type VisibilityLevelId = number;
export type PermissionLevelName = string;
export type PermissionLevelId = number;
export type UserRoleName = string;
export type UserRoleId = number;

export interface GeneratedSharedConfig {
  ENV: string;
  BACKEND_URL: string;
  FRONTEND_URL: string;
  AUTH_KEY: string;
  HEADER_KEYS: HeaderKeys;
  FRONTEND_ROUTES: Record<string, string>;
  SCOPE_NAME_MAPPING: Record<ScopeName, ScopeId>;
  VISIBILITY_LEVEL_NAME_MAPPING: Record<VisibilityLevelName, VisibilityLevelId>;
  PERMISSION_LEVEL_NAME_MAPPING: Record<PermissionLevelName, PermissionLevelId>;
  USER_ROLE_NAME_MAPPING: Record<UserRoleName, UserRoleId>;
  USER_ROLE_SCOPES: Record<UserRoleName, ScopeName[]>;
  OTP_LENGTH: number;
  GOOGLE_CLIENT_ID: string;
}

interface ViteConfig {
  server: any;
}

export type FrontendConfig = Partial<{
  VITE: ViteConfig;
  OPENAPI_SCHEMA_PATHS: {
    gallery: string;
  };
}>;

export interface Config {
  env: string;
  backendUrl: string;
  frontendUrl: string;
  vite: ViteConfig;
  apiSchemaPaths: {
    gallery: string;
  };
  apiSchemas: {
    gallery: GalleryApiSchema;
  };
  authKey: string;
  headerKeys: HeaderKeys;
  frontendRoutes: Record<string, string>;
  scopeNameMapping: Record<ScopeName, ScopeId>;
  scopeIdMapping: Record<ScopeId, ScopeName>;
  visibilityLevelNameMapping: Record<VisibilityLevelName, VisibilityLevelId>;
  visibilityLevelIdMapping: Record<VisibilityLevelId, VisibilityLevelName>;
  permissionLevelNameMapping: Record<PermissionLevelName, PermissionLevelId>;
  permissionLevelIdMapping: Record<PermissionLevelId, PermissionLevelName>;
  userRoleNameMapping: Record<UserRoleName, UserRoleId>;
  userRoleIdMapping: Record<UserRoleId, UserRoleName>;
  userRoleScopes: Record<UserRoleName, Set<ScopeName>>;
  otpLength: number;
  googleClientId: string;
}

export interface EnvVarMapping {
  env: 'ARBOR_IMAGO_ENV';
  configDir: 'ARBOR_IMAGO_CONFIG_DIR';
  envPath: 'ARBOR_IMAGO_ENV_PATH';
  frontendConfigPath: 'ARBOR_IMAGO_FRONTEND_CONFIG_PATH';
  generatedSharedConfigPath: 'ARBOR_IMAGO_GENERATED_SHARED_CONFIG_PATH';
}

export type EnvVar = EnvVarMapping[keyof EnvVarMapping];
