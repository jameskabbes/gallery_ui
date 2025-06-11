import React from 'react';
import { paths, operations, components } from './openapi_schema_client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { E164Number } from 'libphonenumber-js';
import { OpenapiSchema } from './openapi_schema';

export type GetElementTypeFromArray<T extends any[]> = T extends (infer U)[]
  ? U
  : never;

export type FirstKey<T> = keyof {
  [K in keyof T as K extends string ? K : never]: T[K];
} extends infer O
  ? keyof O
  : never;

// all the operations in the OpenAPI schema
export type OpenApiOperation = operations[keyof operations];

// check if a type is an OpenApiOperation
export type IsOpenApiOperation<T> = T extends OpenApiOperation ? true : false;

// find all the keys of the object whose value is an OpenApiOperation
export type OperationKeys<T> = Exclude<
  {
    [K in keyof T]: IsOpenApiOperation<T[K]> extends true ? K : never;
  }[keyof T],
  undefined | never
>;

// find all the paths of `paths` that have valid operations
export type PathsWithOperations = {
  [P in keyof paths]: OperationKeys<paths[P]> extends never ? never : P;
}[keyof paths];

// find all methods of a path that produce valid operations
export type OperationMethodsForPath<TPath extends PathsWithOperations> =
  OperationKeys<paths[TPath]>;

export type OpenApiOperationAt<
  TPath extends PathsWithOperations,
  TMethod extends OperationMethodsForPath<TPath>
> = Extract<paths[TPath][TMethod], OpenApiOperation>;

// find the type of the content for a requestBody
export type RequestContentType<TOperation extends OpenApiOperation> = [
  TOperation['requestBody']
] extends [never]
  ? never
  : TOperation['requestBody'] extends { content: infer ContentTypes }
  ? keyof ContentTypes
  : TOperation['requestBody'] extends { content?: infer ContentTypes }
  ? keyof ContentTypes
  : never;

// find the type of the content for a response
export type ResponseContentType<TOperation extends OpenApiOperation> =
  TOperation extends {
    responses: infer Responses;
  }
    ? {
        [StatusCode in keyof Responses]: Responses[StatusCode] extends {
          content: infer ContentTypes;
        }
          ? keyof ContentTypes
          : never;
      }[keyof Responses]
    : never;

// find the status code of a response
export type ResponseStatusCode<TOperation extends OpenApiOperation> =
  TOperation extends {
    responses: infer Responses;
  }
    ? keyof Responses
    : never;

// find the type of the response data for a given status code and content type
export type ResponseDataTypeByStatusCode<
  TOperation extends OpenApiOperation,
  TResponseContentType extends ResponseContentType<TOperation> = ResponseContentType<TOperation>,
  TResponseStatusCode extends ResponseStatusCode<TOperation> = ResponseStatusCode<TOperation>
> = TOperation extends {
  responses: infer Responses;
}
  ? {
      [K in keyof Responses]: K extends TResponseStatusCode
        ? Responses[K] extends {
            content: infer ContentTypes;
          }
          ? TResponseContentType extends keyof ContentTypes
            ? ContentTypes[TResponseContentType]
            : never
          : never
        : never;
    }
  : never;

// find the type of the response data for a given status code and content type
export type ResponseDataType<
  TOperation extends OpenApiOperation,
  TResponseContentType extends ResponseContentType<TOperation> = ResponseContentType<TOperation>,
  TResponseStatusCode extends ResponseStatusCode<TOperation> = ResponseStatusCode<TOperation>,
  TResponseDataByStatus = ResponseDataTypeByStatusCode<
    TOperation,
    TResponseContentType,
    TResponseStatusCode
  >
> = TResponseDataByStatus[keyof TResponseDataByStatus];

// find the type of the request data for a given content type
export type RequestDataTypeProp<
  TOperation extends OpenApiOperation,
  TRequestContentType extends RequestContentType<TOperation> = RequestContentType<TOperation>
> = TOperation extends {
  requestBody: infer RequestBody;
}
  ? RequestBody extends { content: infer ContentTypes }
    ? { data: ContentTypes[keyof ContentTypes & TRequestContentType] }
    : RequestBody extends { content?: infer ContentTypes }
    ? { data?: ContentTypes[keyof ContentTypes & TRequestContentType] }
    : { data?: never }
  : TOperation extends { requestBody?: infer RequestBody }
  ? RequestBody extends
      | { content: infer ContentTypes }
      | { content?: infer ContentTypes }
    ? { data?: ContentTypes[keyof ContentTypes & TRequestContentType] }
    : { data?: never }
  : { data?: never };

export type RequestDataType<
  TOperation extends OpenApiOperation,
  TRequestContentType extends RequestContentType<TOperation> = RequestContentType<TOperation>
> = RequestDataTypeProp<TOperation, TRequestContentType>['data'];

export type RequestParamsTypeProp<TOperation> = TOperation extends {
  parameters: infer Params;
}
  ? Params extends { query: infer U }
    ? { params: U }
    : Params extends { query?: infer U }
    ? { params?: U }
    : { params?: never }
  : // whenever the generic isn't set
    { params?: never };

export type RequestParamsType<TOperation extends OpenApiOperation> =
  RequestParamsTypeProp<TOperation>['params'];

export type RequestPathParamsTypeProp<TOperation extends OpenApiOperation> =
  TOperation extends {
    parameters: infer Params;
  }
    ? Params extends { path: infer U }
      ? { pathParams: U }
      : Params extends { path?: infer U }
      ? { pathParams?: U }
      : { pathParams?: never }
    : // whenever the generic isn't set
      { pathParams?: never };

export type RequestPathParamsType<TOperation extends OpenApiOperation> =
  RequestPathParamsTypeProp<TOperation>['pathParams'];

type a = PathsWithOperations;
type b = OperationMethodsForPath<'/divisions/'>;

type c = paths['/divisions/']['get'];

// Extract the parameters type for the ApiService function
export type ApiServiceCallParams<
  TPath extends PathsWithOperations,
  TMethod extends OperationMethodsForPath<TPath>,
  TRequestContentType extends RequestContentType<
    OpenApiOperationAt<TPath, TMethod>
  >,
  TRequestData
> = Omit<
  CallApiOptions<TRequestData>,
  'url' | 'method' | 'data' | 'params' | 'pathParams'
> &
  RequestDataTypeProp<OpenApiOperationAt<TPath, TMethod>, TRequestContentType> &
  RequestParamsTypeProp<OpenApiOperationAt<TPath, TMethod>> &
  RequestPathParamsTypeProp<OpenApiOperationAt<TPath, TMethod>>;

export type ApiService<
  TPath extends PathsWithOperations,
  TMethod extends OperationMethodsForPath<TPath>,
  TResponseContentType extends ResponseContentType<
    OpenApiOperationAt<TPath, TMethod>
  >,
  TResponseStatusCode extends ResponseStatusCode<
    OpenApiOperationAt<TPath, TMethod>
  >,
  TResponseDataByStatus extends ResponseDataTypeByStatusCode<
    OpenApiOperationAt<TPath, TMethod>,
    TResponseContentType,
    TResponseStatusCode
  >,
  TResponseDataType extends ResponseDataType<
    OpenApiOperationAt<TPath, TMethod>,
    TResponseContentType,
    TResponseStatusCode
  >,
  TRequestContentType extends RequestContentType<
    OpenApiOperationAt<TPath, TMethod>
  >,
  TRequestDataType extends RequestDataType<
    OpenApiOperationAt<TPath, TMethod>,
    TRequestContentType
  >
> = {
  call: (
    options: ApiServiceCallParams<
      TPath,
      TMethod,
      TRequestContentType,
      TRequestDataType
    >
  ) => Promise<AxiosResponse<TResponseDataType>>;
};

// Utility type to extract TResponseDataByStatus from ApiService
export type ApiServiceResponseDataByStatus<T = any> = T extends ApiService<
  PathsWithOperations, // TPath
  OperationMethodsForPath<PathsWithOperations>, // TMethod
  any, // TResponseContentType
  any, // TResponseStatusCode
  infer TResponseDataByStatus, // <-- This is what we want
  unknown, // TResponseData
  never, // TRequestContentType
  never // TRequestData
>
  ? TResponseDataByStatus
  : never;

export interface CallApiOptions<TRequestData>
  extends AxiosRequestConfig<TRequestData> {
  url: AxiosRequestConfig<TRequestData>['url'];
  method: AxiosRequestConfig<TRequestData>['method'];
}

// Make all AxiosResponse fields optional and possibly undefined
type PartialAxiosResponse<T> = {
  [K in keyof AxiosResponse<T>]?: AxiosResponse<T>[K];
};

export interface UseApiCallReturn<TData> extends PartialAxiosResponse<TData> {
  refetch: () => void;
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface ValidatedInputState<T> {
  value: T;
  status: 'valid' | 'invalid' | 'loading';
  error: string | null;
}

export const defaultValidatedInputState = <T>(
  defaultValue: T
): ValidatedInputState<T> => ({
  value: defaultValue,
  status: 'valid',
  error: null,
});

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
  OPENAPI_SCHEMA_PATH: string;
}

export interface Config {
  backendUrl: string;
  frontendUrl: string;
  vite: ViteConfig;
  openapiSchemaPath: string;
  openapiSchema: OpenapiSchema;
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
