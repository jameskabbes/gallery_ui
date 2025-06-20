import React, { useEffect, useState } from 'react';
import {
  ApiSchemaParameter,
  AuthContextType,
  ToastContextType,
} from '../../types';
import { updateAuthFromFetchResponse, useApiCall } from '../../utils/api';
import { paths, operations, components } from '../../gallery_api_schema_client';
import {
  deleteUserAccessToken,
  getUserAccessTokens,
  getUserAccessTokensSettingsPage,
} from '../../services/api-services/gallery';
import { config } from '../../config/config';
import { Card1 } from '../Utils/Card';
import { Button1 } from '../Utils/Button';
import { useConfirmationModal } from '../../utils/useConfirmationModal';
import { Loader1 } from '../Utils/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from '../Utils/Pagination';
import { getQueryParamKeys } from '../../utils/queryParams';
import { galleryClient } from '../../utils/apiClient';
import { GalleryApiSchema } from '../../gallery_api_schema';

type TUserAccessToken = components['schemas']['UserAccessToken'];
type TUserAccessTokens = Record<TUserAccessToken['id'], TUserAccessToken>;

type QueryParams = NonNullable<
  (typeof getUserAccessTokensSettingsPage.parameterSchemasClientByType)['query']
>;
type QueryParamKeys = keyof QueryParams;

type a =
  (typeof getUserAccessTokensSettingsPage.parameterSchemasByType)['query']['limit'];

type c = ApiSchemaParameter<
  GalleryApiSchema,
  '/pages/settings/user-access-tokens/',
  'get'
>;

type b = typeof getUserAccessTokensSettingsPage.parameterSchemasClientByType;

const b =
  getUserAccessTokensSettingsPage.parameterSchemasByType.query.limit['default'];

// const queryParamSchemas: QueryParamSchemas = (() => {})();

// getUserAccessTokensSettingsPage.parametersSchemaByType['query']

interface Props {
  authContext: AuthContextType;
  toastContext: ToastContextType;
}

export function UserAccessTokens({ authContext, toastContext }: Props) {
  const { activateButtonConfirmation } = useConfirmationModal();

  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  const [queryParams, setQueryParams] = useState<QueryParams>(
    () =>
      Object.fromEntries(
        queryKeys.map((key) => [key, queryParamSchemas[key].default])
      ) as QueryParams
  );

  function getLimitFromQuery(limit: string | null): QueryParams['limit'] {
    if (limit === null) {
      return queryParamSchemas['limit'].default;
    } else {
      const limitInt = parseInt(limit, 10);
      if (isNaN(limitInt)) {
        return queryParamSchemas['limit'].default;
      } else {
        return Math.min(
          queryParamSchemas['limit'].maximum,
          Math.max(queryParamSchemas['limit'].minimum, limitInt)
        );
      }
    }
  }

  function getOffsetFromQuery(offset: string): Params['offset'] {
    if (!offset) {
      return queryParamObjects['offset'].schema.default;
    } else {
      const offsetInt = parseInt(offset, 10);
      if (isNaN(offsetInt)) {
        return queryParamObjects['offset'].schema.default;
      } else {
        return Math.max(queryParamObjects['offset'].schema.minimum, offsetInt);
      }
    }
  }

  const [limit, setLimit] = useState<Params['limit']>(
    getLimitFromQuery(query.get('limit'))
  );

  const [offset, setOffset] = useState<Params['offset']>(
    getOffsetFromQuery(query.get('offset'))
  );

  //   Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (limit !== queryParamObjects['limit'].schema.default)
      params.set('limit', limit.toString());
    if (offset !== queryParamObjects['offset'].schema.default)
      params.set('offset', offset.toString());

    const newSearch = params.toString();
    if (newSearch !== location.search) {
      navigate({ search: newSearch });
    }
  }, [limit, offset]);

  const [userAccessTokenCount, setUserAccessTokenCount] = useState<
    number | null
  >(null);
  const [userAccessTokens, setUserAccessTokens] = useState<TUserAccessTokens>(
    {}
  );
  const [userAccessTokenIdIndex, setUserAccessTokenIdIndex] = useState<
    TUserAccessToken['id'][]
  >([]);

  const { data, loading, refetch } = useApiCall(
    getUserAccessTokensSettingsPage,
    [],
    {
      params: {
        query: {
          limit: limit,
          offset: offset,
        },
      },
    }
  );

  const hasMounted = React.useRef(false);

  // refetch when limit, offset, orderBy, or orderByDesc changes
  useEffect(() => {
    if (hasMounted.current) {
      refetch();
    } else {
      hasMounted.current = true;
    }
  }, [offset, limit]);

  useEffect(() => {
    if (data !== undefined) {
      setUserAccessTokenCount(data.user_access_token_count);
      setUserAccessTokens(() => {
        const newUserAccessTokens: TUserAccessTokens = {};
        for (const userAccessToken of data.user_access_tokens) {
          newUserAccessTokens[userAccessToken.id] = userAccessToken;
        }
        return newUserAccessTokens;
      });
      setUserAccessTokenIdIndex(() =>
        data.user_access_tokens.map((userAccessToken) => userAccessToken.id)
      );
    }
  }, [data]);

  async function handleDeleteUserAccessToken(index: number) {
    const sessionId = userAccessTokenIdIndex[index];

    let toastId = toastContext.makePending({
      message: 'Deleting session...',
    });

    setUserAccessTokenIdIndex((prevUserAccessTokenIdIndex) => {
      const newUserAccessTokenIdIndex = [...prevUserAccessTokenIdIndex];
      newUserAccessTokenIdIndex.splice(index, 1);
      return newUserAccessTokenIdIndex;
    });

    setUserAccessTokenCount((prev) => prev - 1);

    const { data } = updateAuthFromFetchResponse(
      await deleteUserAccessToken.request({
        params: {
          path: {
            user_access_token_id: sessionId,
          },
        },
      }),
      authContext
    );

    if (status === 204) {
      toastContext.update(toastId, {
        message: `Deleted session`,
        type: 'success',
      });

      setUserAccessTokens((prevUserAccessTokens) => {
        const newUserAccessTokens = { ...prevUserAccessTokens };
        delete newUserAccessTokens[sessionId];
        return newUserAccessTokens;
      });
    } else {
      toastContext.update(toastId, {
        message: 'Could not delete session',
        type: 'error',
      });

      setUserAccessTokenIdIndex((prevUserAccessTokenIdIndex) => {
        // add the item back into the array at postiion index
        const newUserAccessTokenIdIndex = [...prevUserAccessTokenIdIndex];
        newUserAccessTokenIdIndex.splice(index, 0, sessionId);
        return newUserAccessTokenIdIndex;
      });

      setUserAccessTokenCount((prev) => prev + 1);
    }
  }

  if (authContext.state.user !== null) {
    return (
      <>
        <h2 className="mb-4">Sessions</h2>
        <Card1>
          <div className="flex flex-row justify-end">
            <Pagination
              loading={loading}
              offset={offset}
              setOffset={setOffset}
              limit={limit}
              setLimit={setLimit}
              count={userAccessTokenIdIndex.length}
              total={userAccessTokenCount}
            />
          </div>
          {userAccessTokenIdIndex.map((userAccessTokenId, index) => {
            const userAccessToken = userAccessTokens[userAccessTokenId];
            return (
              <Card1
                key={userAccessTokenId}
                className="flex flex-row justify-between items-center m-1"
              >
                <p>
                  Issued:{' '}
                  {new Date(userAccessToken.issued).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </p>
                <p>
                  {authContext.state.access_token?.id ===
                    userAccessToken.id && <span>Current Session</span>}
                </p>
                <Button1
                  onClick={() => {
                    if (
                      authContext.state.access_token?.id === userAccessToken.id
                    ) {
                      activateButtonConfirmation({
                        componentProps: {
                          title: 'Sign Out?',
                          message:
                            'This will sign you out of your current session.',
                          onConfirm: () => handleDeleteUserAccessToken(index),
                          confirmText: 'Sign Out',
                        },
                      });
                    } else {
                      handleDeleteUserAccessToken(index);
                    }
                  }}
                >
                  Sign Out
                </Button1>
              </Card1>
            );
          })}
        </Card1>
      </>
    );
  }
}
