import { useState, useEffect, useCallback, useContext } from 'react';
import { paths, components } from '../gallery_api_schema_client';
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
  if (fetchResponse.data !== undefined) {
    handleAuthContext(
      authContext,
      fetchResponse.response.headers,
      fetchResponse.data
    );
  }
  return fetchResponse;
}

export function useApiCall<
  TMethod extends HttpMethod,
  TPath extends PathsWithMethod<paths, TMethod>,
  TMedia extends MediaType = `${string}/${string}`
>(
  apiService: ApiService<TMethod, TPath>,
  dependencies: any[],
  ...init: Parameters<ApiService<TMethod, TPath>>
): Partial<
  FetchResponse<
    paths[TPath][TMethod] & Record<string, any>,
    MaybeOptionalInit<paths[TPath], TMethod>,
    TMedia
  >
> & {
  refetch: () => Promise<void>;
  loading: boolean;
} {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<
    Partial<
      FetchResponse<
        paths[TPath][TMethod] & Record<string, any>,
        MaybeOptionalInit<paths[TPath], TMethod>,
        TMedia
      >
    >
  >({});

  // The refetch function (keep this!)
  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const result = updateAuthFromFetchResponse(
        await apiService(...init),
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
