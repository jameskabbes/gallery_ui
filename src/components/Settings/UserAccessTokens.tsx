import React, { useEffect, useState } from 'react';
import {
  ApiSchemaParameter,
  AuthContextType,
  ToastContextType,
} from '../../types';
import { updateAuthFromFetchResponse, useApiCall } from '../../utils/api';
import {
  paths,
  operations,
  components,
} from '../../types/gallery/api_schema_client';
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
import { boundNumber } from '../../utils/boundNumber';
import { galleryClient } from '../../utils/apiClient';

type TUserAccessToken = components['schemas']['UserAccessToken'];
type TUserAccessTokens = Record<TUserAccessToken['id'], TUserAccessToken>;

interface Props {
  authContext: AuthContextType;
  toastContext: ToastContextType;
}

type RequiredQueryParams = Required<
  NonNullable<
    (typeof getUserAccessTokensSettingsPage)['apiSchemaClientParametersByType']['query']
  >
>;

const queryParamSchemas =
  getUserAccessTokensSettingsPage.apiSchemaParameterSchemasByType.query;
const queryParamKeys = getQueryParamKeys(queryParamSchemas);

export function UserAccessTokens({ authContext, toastContext }: Props) {
  const { activateButtonConfirmation } = useConfirmationModal();

  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  function getQueryParamsFromQuery(
    query: URLSearchParams
  ): RequiredQueryParams {
    const limit = query.get('limit');
    const offset = query.get('offset');

    return {
      limit:
        limit === null
          ? queryParamSchemas['limit'].schema.default
          : boundNumber(
              Number(limit),
              queryParamSchemas['limit'].schema.default,
              queryParamSchemas['limit'].schema.minimum,
              queryParamSchemas['limit'].schema.maximum
            ),
      offset:
        offset === null
          ? queryParamSchemas['offset'].schema.default
          : boundNumber(
              Number(offset),
              queryParamSchemas['offset'].schema.default,
              queryParamSchemas['offset'].schema.minimum,
              queryParamSchemas['offset'].schema.maximum
            ),
    };
  }

  const [queryParams, setQueryParams] = useState<RequiredQueryParams>(
    getQueryParamsFromQuery(query)
  );

  //   Update URL when state changes
  useEffect(() => {
    const query = new URLSearchParams();

    for (const key of queryParamKeys) {
      if (queryParams[key] !== queryParamSchemas[key].schema.default) {
        query.set(key, queryParams[key].toString());
      }
    }

    const newSearch = query.toString();
    if (newSearch !== location.search) {
      navigate({ search: newSearch });
    }
  }, [queryParams]);

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
    [queryParams],
    {
      params: {
        query: queryParams,
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
  }, [queryParams]);

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
    if (sessionId === undefined) {
      console.error('Session ID is undefined at index:', index);
      return;
    }

    let toastId = toastContext.makePending({
      message: 'Deleting session...',
    });

    setUserAccessTokenIdIndex((prevUserAccessTokenIdIndex) => {
      const newUserAccessTokenIdIndex = [...prevUserAccessTokenIdIndex];
      newUserAccessTokenIdIndex.splice(index, 1);
      return newUserAccessTokenIdIndex;
    });

    setUserAccessTokenCount((prev) => (prev === null ? 0 : prev - 1));

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

    if (data !== undefined) {
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

      setUserAccessTokenCount((prev) => (prev === null ? 0 : prev + 1));
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
              offset={queryParams.offset}
              setOffset={(offset: number) => {
                setQueryParams((prev) => ({ ...prev, offset }));
              }}
              limit={queryParams.limit}
              setLimit={(limit: number) => {
                setQueryParams((prev) => ({ ...prev, limit }));
              }}
              count={userAccessTokenIdIndex.length}
              total={userAccessTokenCount}
            />
          </div>
          {userAccessTokenIdIndex.map((userAccessTokenId, index) => {
            const userAccessToken = userAccessTokens[userAccessTokenId];
            if (userAccessToken === undefined) {
              console.error(
                `User access token with ID ${userAccessTokenId} not found in userAccessTokens`
              );
              return null;
            }

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
