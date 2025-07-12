import { useState, useEffect, useCallback, useContext } from 'react';
import { paths, components } from '../types/gallery/api_schema_client';
import { ApiService, AuthContextType } from '../types';
import { config } from '../config/config';
import {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from 'openapi-typescript-helpers';
import { FetchResponse, MaybeOptionalInit } from 'openapi-fetch';
import { AuthContext } from '../contexts/Auth';

// Then implement the hook as a const expression

function handleAuthContext<T>(
  authContext: AuthContextType,
  headers: FetchResponse<any, any, any>['response']['headers'],
  data: T
) {
  if (authContext && headers.get(config.headerKeys['auth_logout'])) {
    authContext.logOut();
  }
  if (authContext) {
    authContext.updateFromApiResponse(data);
  }
}

export function updateAuthFromFetchResponse<
  T extends FetchResponse<any, any, any>
>(fetchResponse: T, authContext: AuthContextType): T {
  handleAuthContext(
    authContext,
    fetchResponse.response.headers,
    fetchResponse.data
  );
  return fetchResponse;
}

export function useApiCall<
  TPaths extends {},
  TApiSchema extends { paths: any },
  TMethod extends HttpMethod &
    keyof TPaths[TPath] &
    keyof TApiSchema['paths'][TPath],
  TPath extends PathsWithMethod<TPaths, TMethod> & keyof TApiSchema['paths'],
  TMedia extends MediaType = `${string}/${string}`
>(
  apiService: ApiService<TPaths, TApiSchema, TMethod, TPath, TMedia>,
  dependencies: any[],
  ...init: Parameters<
    ApiService<TPaths, TApiSchema, TMethod, TPath, TMedia>['request']
  >
): Partial<
  Awaited<
    ReturnType<
      ApiService<TPaths, TApiSchema, TMethod, TPath, TMedia>['request']
    >
  >
> & {
  refetch: () => Promise<void>;
  loading: boolean;
} {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<
    Partial<
      Awaited<
        ReturnType<
          ApiService<TPaths, TApiSchema, TMethod, TPath, TMedia>['request']
        >
      >
    >
  >({});

  // The refetch function (keep this!)
  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const result = updateAuthFromFetchResponse(
        await apiService.request(...init),
        authContext
      );
      setResponse(result);
    } finally {
      setLoading(false);
    }
  }, [apiService, ...dependencies]); // Proper dependencies

  // This handles automatic fetching when dependencies change
  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...response, refetch, loading };
}
