import React from 'react';
import { paths, operations, components } from './gallery_api_schema_client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { E164Number } from 'libphonenumber-js';
import { GalleryApiSchema } from './gallery_api_schema';

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

// Simplified main type using the helper
export type ApiSchemaParametersByType<
  TApiSchemaClientParameters extends {
    query?: TApiSchemaClientQuery;
    path?: TApiSchemaClientPath;
    cookie?: TApiSchemaClientCookie;
    header?: TApiSchemaClientHeader;
  },
  TQuery,
  TPath,
  TCookie,
  THeader
> = {
  query: ParameterTypeHelper<TApiSchemaClientParameters, 'query', TQuery>;
  path: ParameterTypeHelper<TApiSchemaClientParameters, 'path', TPath>;
  cookie: ParameterTypeHelper<TApiSchemaClientParameters, 'cookie', TCookie>;
  header: ParameterTypeHelper<TApiSchemaClientParameters, 'header', THeader>;
};

export type ApiSchemaClientParametersType<TApiSchemaClientOperation> =
  'parameters' extends keyof TApiSchemaClientOperation
    ? TApiSchemaClientOperation['parameters']
    : never;

export interface ApiService<
  TPaths,
  TApiSchema,
  TMethod extends HttpMethod,
  TPath extends PathsWithMethod<TPaths, TMethod>,
  TMediaType extends MediaType = `${string}/${string}`,
  TInit extends MaybeOptionalInit<TPaths[TPath], TMethod> = MaybeOptionalInit<
    TPaths[TPath],
    TMethod
  >
> {
  method: TMethod;
  url: TPath;
  apiSchemaClientOperation: TPaths[TPath][TMethod];
  parameterSchemasByType: ApiSchemaParametersByType<
    ApiSchemaClientParametersType<TPaths[TPath][TMethod]>,
    ApiSchemaParameters<TApiSchema, TPath, TMethod>,
    ApiSchemaParameters<TApiSchema, TPath, TMethod>,
    ApiSchemaParameters<TApiSchema, TPath, TMethod>,
    ApiSchemaParameters<TApiSchema, TPath, TMethod>
  >;
  parameterSchemasClientByType: TPaths[TPath][TMethod]['parameters'];
  request: (
    ...init: MyInitParam<TInit>
  ) => Promise<
    FetchResponse<
      TPaths[TPath][TMethod] & Record<string, any>,
      TInit,
      TMediaType
    >
  >;
}

export type ApiSchemaParameter<
  TApiSchema,
  TPath extends keyof TApiSchema['paths'],
  TMethod extends keyof TApiSchema['paths'][TPath]
> = TApiSchema extends {
  paths: Record<TPath, Record<TMethod, { parameters: infer TParameters }>>;
}
  ? GetElementTypeFromArray<TParameters>
  : never;

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

export interface SharedConfig {
  BACKEND_URL: string;
  FRONTEND_URL: string;
  AUTH_KEY: string;
  HEADER_KEYS: HeaderKeys;
  FRONTEND_ROUTES: Record<string, string>;
  SCOPE_NAME_MAPPING: Record<string, number>;
  VISIBILITY_LEVEL_NAME_MAPPING: Record<string, number>;
  PERMISSION_LEVEL_NAME_MAPPING: Record<string, number>;
  USER_ROLE_NAME_MAPPING: Record<string, number>;
  USER_ROLE_SCOPES: Record<string, string[]>;
  OTP_LENGTH: number;
  GOOGLE_CLIENT_ID: string;
}

interface ViteConfig {
  server: {
    port: number;
    host: boolean;
  };
}

export interface FrontendConfig {
  VITE: ViteConfig;
  OPENAPI_SCHEMA_PATHS: {
    gallery: string;
  };
}

export interface Config {
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
  scopeNameMapping: Record<string, number>;
  scopeIdMapping: Record<number, string>;
  visibilityLevelNameMapping: Record<string, number>;
  visibilityLevelIdMapping: Record<number, string>;
  permissionLevelNameMapping: Record<string, number>;
  permissionLevelIdMapping: Record<number, string>;
  userRoleNameMapping: Record<string, number>;
  userRoleIdMapping: Record<number, string>;
  userRoleScopes: Record<string, string[]>;
  otpLength: number;
  googleClientId: string;
}
