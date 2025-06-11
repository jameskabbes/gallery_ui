import { useState, useEffect } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import {
  CallApiOptions,
  UseApiCallReturn,
  ResponseContentType,
  ResponseStatusCode,
  ResponseDataTypeByStatusCode,
  ResponseDataType,
  ApiService,
  RequestContentType,
  RequestDataType,
  OperationMethodsForPath,
  PathsWithOperations,
  ApiServiceCallParams,
  OpenApiOperationAt,
} from '../types';
import { config } from '../config/config';
import { OpenapiSchema } from '../openapi_schema';

export async function callApi<TResponseData, TRequestData = any>({
  url,
  method,
  ...rest
}: CallApiOptions<TRequestData>): Promise<AxiosResponse<TResponseData>> {
  try {
    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      ...rest,
    };

    console.log(method, url);
    const response = await apiClient.request<TResponseData>(requestConfig);

    return response;
  } catch (error) {
    throw error;
  }
}

export function createApiService<
  TPath extends PathsWithOperations,
  TMethod extends OperationMethodsForPath<TPath> & AxiosRequestConfig['method'],
  TResponseContentType extends ResponseContentType<
    OpenApiOperationAt<TPath, TMethod>
  > = ResponseContentType<OpenApiOperationAt<TPath, TMethod>>,
  TResponseStatusCode extends ResponseStatusCode<
    OpenApiOperationAt<TPath, TMethod>
  > = ResponseStatusCode<OpenApiOperationAt<TPath, TMethod>>,
  TResponseDataByStatus extends ResponseDataTypeByStatusCode<
    OpenApiOperationAt<TPath, TMethod>,
    TResponseContentType,
    TResponseStatusCode
  > = ResponseDataTypeByStatusCode<
    OpenApiOperationAt<TPath, TMethod>,
    TResponseContentType,
    TResponseStatusCode
  >,
  TResponseData extends ResponseDataType<
    OpenApiOperationAt<TPath, TMethod>,
    TResponseContentType,
    TResponseStatusCode
  > = ResponseDataType<
    OpenApiOperationAt<TPath, TMethod>,
    TResponseContentType,
    TResponseStatusCode
  >,
  TRequestContentType extends RequestContentType<
    OpenApiOperationAt<TPath, TMethod>
  > = RequestContentType<OpenApiOperationAt<TPath, TMethod>>,
  TRequestData extends RequestDataType<
    OpenApiOperationAt<TPath, TMethod>,
    TRequestContentType
  > = RequestDataType<OpenApiOperationAt<TPath, TMethod>, TRequestContentType>
>(
  path: TPath,
  method: TMethod,
  requestContentType?: TRequestContentType | null,
  responseContentType?: TResponseContentType | null
): ApiService<
  TPath,
  TMethod,
  TResponseContentType,
  TResponseStatusCode,
  TResponseDataByStatus,
  TResponseData,
  TRequestContentType,
  TRequestData
> {
  // default to find the content type from the first request content
  const operation = config.openapiSchema.paths[
    path as keyof OpenapiSchema['paths']
  ][
    method as keyof OpenapiSchema['paths'][keyof OpenapiSchema['paths']]
  ] as OpenApiOperationAt<TPath, TMethod>;

  if (!requestContentType) {
    requestContentType = operation?.requestBody?.content
      ? (Object.keys(operation.requestBody.content)[0] as TRequestContentType)
      : null;
  }

  // default to find the content type from the first request content
  if (!responseContentType) {
    const firstStatusCodeStr = Object.keys(operation.responses)[0];
    const firstStatusCode = Number(
      firstStatusCodeStr
    ) as keyof typeof operation.responses;
    const firstStatusCodeObject = operation.responses[firstStatusCode];
    const firstContent = firstStatusCodeObject?.content;

    if (firstContent) {
      responseContentType = Object.keys(
        firstContent
      )[0] as TResponseContentType;
    } else {
      responseContentType = null;
    }
  }

  const call = async ({
    pathParams,
    headers = {},
    ...rest
  }: ApiServiceCallParams<
    TPath,
    TMethod,
    TRequestContentType,
    TRequestData
  >) => {
    let url: CallApiOptions<TRequestData>['url'] = path;
    if (pathParams && typeof pathParams === 'object' && url !== undefined) {
      for (const key in pathParams) {
        url = url.replace(
          `{${key}}`,
          pathParams[key as keyof typeof pathParams]
        );
      }
    }

    const r = await callApi<TResponseData, TRequestData>({
      url,
      method,
      headers: {
        ...(requestContentType ? { 'Content-Type': requestContentType } : {}),
        ...(responseContentType ? { Accept: responseContentType } : {}),
        ...headers,
      },
      ...rest,
    });
    return r;
  };

  return {
    call,
  };
}

export function useApiCall<
  TPath extends PathsWithOperations,
  TMethod extends OperationMethodsForPath<TPath>,
  TResponseContentType extends ResponseContentType<
    OpenApiOperationAt<TPath, TMethod>
  >,
  TRequestContentType extends RequestContentType<
    OpenApiOperationAt<TPath, TMethod>
  >,
  TResponseStatusCode extends ResponseStatusCode<
    OpenApiOperationAt<TPath, TMethod>
  >,
  TRequestData extends RequestDataType<
    OpenApiOperationAt<TPath, TMethod>,
    TRequestContentType
  >,
  TResponseData extends ResponseDataType<
    OpenApiOperationAt<TPath, TMethod>,
    TResponseContentType,
    TResponseStatusCode
  >,
  TResponseDataByStatus extends ResponseDataTypeByStatusCode<
    OpenApiOperationAt<TPath, TMethod>,
    TResponseContentType,
    TResponseStatusCode
  >
>(
  apiService: ApiService<
    TPath,
    TMethod,
    TResponseContentType,
    TResponseStatusCode,
    TResponseDataByStatus,
    TResponseData,
    TRequestContentType,
    TRequestData
  >,
  apiServiceOptions: ApiServiceCallParams<
    TPath,
    TMethod,
    TRequestContentType,
    TResponseData
  >,
  dependencies: any[] = []
): UseApiCallReturn<TResponseData> {
  const [response, setResponse] = useState<
    AxiosResponse<TResponseData> | undefined
  >(undefined);

  async function refetch() {
    setResponse(await apiService.call(apiServiceOptions));
  }

  useEffect(() => {
    refetch();
  }, dependencies);

  return { ...response, refetch };
}
