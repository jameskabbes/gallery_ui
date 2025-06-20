import { HttpMethod, PathsWithMethod } from 'openapi-typescript-helpers';
import { Client } from 'openapi-fetch';
import {
  ApiService,
  ApiSchemaParametersByType,
  ApiSchemaParameter,
  ApiSchemaClientParametersByType,
  PossibleApiSchemaClientPaths,
  PossibleApiSchema,
} from '../../types';

export function createApiServiceFactory<
  TApiSchemaClientPaths extends PossibleApiSchemaClientPaths,
  TApiSchema extends PossibleApiSchema,
  TClient extends Client<any> = Client<any>
>(api_schema: TApiSchema, client: TClient) {
  return function createApiService<
    TPath extends keyof TApiSchema['paths'] &
      Extract<PathsWithMethod<TApiSchemaClientPaths, TMethod>, string>,
    TMethod extends HttpMethod &
      keyof TApiSchemaClientPaths[TPath] &
      keyof TApiSchema['paths'][TPath]
  >(
    method: TMethod,
    url: TPath
  ): ApiService<TApiSchemaClientPaths, TApiSchema, TMethod, TPath> {
    const operation = (api_schema.paths as any)[url][method];

    let apiSchemaParameterSchemasByType = {};

    if (!!operation) {
      if (!!operation.parameters) {
        operation.parameters.forEach(
          (param: {
            name: string;
            in: keyof ApiSchemaParametersByType<any, any>;
          }) => {
            if (!(param.in in apiSchemaParameterSchemasByType)) {
              (apiSchemaParameterSchemasByType as any)[param.in] = {};
            }
            (apiSchemaParameterSchemasByType as any)[param.in][param.name] =
              param;
          }
        );
      }
    }

    type ServiceApiSchemaClientOperation =
      TApiSchemaClientPaths[TPath][TMethod];
    type ServiceApiSchemaParameter = ApiSchemaParameter<
      TApiSchema,
      TPath,
      TMethod
    >;
    type ServiceApiSchemaClientParametersByType =
      ApiSchemaClientParametersByType<ServiceApiSchemaClientOperation>;

    return {
      url,
      method,
      apiSchemaClientOperation: {} as ServiceApiSchemaClientOperation,
      apiSchemaParameter: {} as ServiceApiSchemaParameter,
      apiSchemaParameterSchemasByType:
        apiSchemaParameterSchemasByType as ApiSchemaParametersByType<
          ApiSchemaClientParametersByType<ServiceApiSchemaClientOperation>,
          ServiceApiSchemaParameter
        >,
      apiSchemaClientParametersByType:
        {} as ServiceApiSchemaClientParametersByType,
      request: async (...init) => {
        const options = init[0] || {};
        return client.request(method, url, options);
      },
    };
  };
}

// const operations = api_schema.paths[url as keyof typeof api_schema.paths];
// const operation = operations[method as any];

// const queryParametersObjects =
//   operation?.parameters?.filter((param) => param.in === 'query') || [];

// export interface ApiService<
//   TPaths,
//   TMethod extends HttpMethod,
//   TPath extends PathsWithMethod<TPaths, TMethod>
// > {
//   method: TMethod;
//   url: TPath;
//   request: <TInit extends MaybeOptionalInit<TPaths[TPath], TMethod>>(
//     ...init: MyInitParam<TInit>
//   ) => Promise<
//     FetchResponse<
//       TPaths[TPath][TMethod] & Record<string, any>,
//       TInit,
//       MediaType
//     >
//   >;
// }

// function createApiService<
//   TMethod extends HttpMethod,
//   TPath extends PathsWithMethod<paths, TMethod>
// >(method: TMethod, url: TPath): ApiService<TMethod, TPath> {
//   return {
//     method: method,
//     url: url,
//     request: async (...init) => {
//       return galleryClient.request(method, url, ...init);
//     },
//   };
// }
