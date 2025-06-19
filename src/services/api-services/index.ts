import { HttpMethod, PathsWithMethod } from 'openapi-typescript-helpers';
import { Client, FetchOptions, MaybeOptionalInit } from 'openapi-fetch';
import {
  ApiSchemaClientParametersType,
  ApiSchemaParameter,
  ApiService,
  ExtractOrNever,
  ApiSchemaParametersByType,
} from '../../types';
import { paths as GalleryApiClientPaths } from '../../gallery_api_schema_client';
import { GalleryApiSchema } from '../../gallery_api_schema';
import { Config } from '../../types';

type PossibleApiSchemaClientPaths = GalleryApiClientPaths;
type PossibleApiSchema = GalleryApiSchema;

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
    type ServiceApiSchemaClientOperation =
      TApiSchemaClientPaths[TPath][TMethod];
    const operation = (api_schema.paths as any)[url][method];

    type ServiceApiSchemaParameter = ApiSchemaParameter<
      TApiSchema,
      TPath,
      TMethod
    >;

    // Check if 'parameters' exists on the operation type

    type ServiceApiSchemaClientParameterType = ApiSchemaClientParametersType<
      TApiSchemaClientPaths[TPath][TMethod]
    >;

    type ServiceParameterSchemasByType = ApiSchemaParametersByType<
      ServiceApiSchemaClientParameterType,
      ServiceApiSchemaParameter,
      ServiceApiSchemaParameter,
      ServiceApiSchemaParameter,
      ServiceApiSchemaParameter
    >;

    let parameterSchemasByType = {};

    if (!!operation) {
      if (!!operation.parameters) {
        operation.parameters.forEach(
          (param: {
            name: string;
            in: keyof ServiceParameterSchemasByType;
          }) => {
            if (!(param.in in parameterSchemasByType)) {
              (parameterSchemasByType as any)[param.in] = {};
            }
            (parameterSchemasByType as any)[param.in][param.name] = param;
          }
        );
      }
    }

    return {
      method,
      url,
      apiSchemaClientOperation: {} as ServiceApiSchemaClientOperation,
      request: async (...init) => {
        return client.request(method, url, { ...init });
      },
      parameterSchemasByType:
        parameterSchemasByType as ServiceParameterSchemasByType,
      parameterSchemasClientByType: {} as ServiceApiSchemaClientParameterType,
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
