import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ValidatedInputState,
  ToastContextType,
  AuthContextType,
  ModalsContextType,
  OrderByState,
  ArrayElement,
  ModalType,
  ModalUpdateType,
  GetElementTypeFromArray,
  ScopeId,
  NumericQueryParamSchema,
  ElementType,
} from '../../../types';
import { defaultValidatedInputState } from '../../../utils/useValidatedInput';

import { updateAuthFromFetchResponse, useApiCall } from '../../../utils/api';
import {
  deleteApiKey,
  postApiKey,
  postApiKeyScope,
  deleteApiKeyScope,
  getApiKeyJwt,
  getIsApiKeyAvailable,
  patchApiKey,
  getApiKeysSettingsPage,
} from '../../../services/api-services/gallery';
import { ModalsContext } from '../../../contexts/Modals';
import { useConfirmationModal } from '../../../utils/useConfirmationModal';
import { IoCaretForward } from 'react-icons/io5';
import { ValidatedInputString } from '../../Form/ValidatedInputString';
import { ValidatedInputDatetimeLocal } from '../../Form/ValidatedInputDatetimeLocal';
import { Button1, Button2, ButtonSubmit } from '../../Utils/Button';
import { Card1, CardButton } from '../../Utils/Card';
import { Toggle1 } from '../../Utils/Toggle';
import { config } from '../../../config/config';
import { useValidatedInput } from '../../../utils/useValidatedInput';
import { CheckOrX } from '../../Form/CheckOrX';
import { IoCaretUp, IoCaretDown } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader1 } from '../../Utils/Loader';
import { Surface } from '../../Utils/Surface';
import { Pagination } from '../../Utils/Pagination';
import {
  getQueryParamKeys,
  validateNumericSchema,
} from '../../../utils/queryParams';
import { boundNumber } from '../../../utils/boundNumber';
import type {
  AddApiKeyFunc,
  ApiKey,
  ApiKeyCount,
  ApiKeys,
  ApiKeyScopeIds,
  ApiKeyViewProps,
  DeleteApiKeyFunc,
  ModifyApiKeyScopeFunc,
  SelectedIndex,
  UpdateApiKeyFunc,
} from '../../../types/gallery/types';
import { ApiKeyView, makeApiKeyModalViewKey } from './modals/ApiKeyView';
import { validatePhoneNumberLength } from 'libphonenumber-js';
import { AddApiKey, addApiKeyModalKey } from './forms/AddApiKey';
import { ApiKeyTableRowScope } from './ApiKeyTableRowScope';

interface ApiKeyProps {
  authContext: AuthContextType;
  toastContext: ToastContextType;
}

type RequiredQueryParams = Required<
  NonNullable<
    (typeof getApiKeysSettingsPage)['apiSchemaClientParametersByType']['query']
  >
>;

const queryParamSchemas =
  getApiKeysSettingsPage.apiSchemaParameterSchemasByType.query;
const queryParamKeys = getQueryParamKeys(queryParamSchemas);

const orderByFields = (() => {
  const fields = queryParamSchemas['order_by'].schema?.items?.enum;
  if (fields === undefined) {
    throw new Error('order_by enum is not defined in API schema');
  } else {
    return new Set(fields as RequiredQueryParams['order_by']);
  }
})();

const orderByDescFields = (() => {
  const fields = queryParamSchemas['order_by_desc'].schema?.items?.enum;
  if (fields === undefined) {
    throw new Error('order_by_desc enum is not defined in API schema');
  } else {
    return new Set(fields as RequiredQueryParams['order_by_desc']);
  }
})();

const limitSchema = validateNumericSchema(queryParamSchemas['limit'].schema);
const offsetSchema = validateNumericSchema(queryParamSchemas['offset'].schema);

function boundLimit(
  limit: RequiredQueryParams['limit']
): RequiredQueryParams['limit'] {
  return boundNumber(
    limit,
    limitSchema.default,
    limitSchema.minimum,
    limitSchema.maximum
  );
}

function boundOffset(
  offset: RequiredQueryParams['offset']
): RequiredQueryParams['offset'] {
  return boundNumber(
    offset,
    offsetSchema.default,
    offsetSchema.minimum,
    offsetSchema.maximum
  );
}

export function ApiKeys({ authContext, toastContext }: ApiKeyProps) {
  const modalsContext = useContext(ModalsContext);
  const { activateButtonConfirmation } = useConfirmationModal();

  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  function getQueryParamsFromQuery(
    query: URLSearchParams
  ): RequiredQueryParams {
    const limit = query.get('limit');
    const offset = query.get('offset');
    const orderBy = query.getAll('order_by');
    const orderByDesc = query.getAll('order_by_desc');
    return {
      limit: (() => {
        if (limit === null) {
          return limitSchema.default;
        } else {
          return boundLimit(Number(limit));
        }
      })(),

      offset: (() => {
        if (offset === null) {
          return offsetSchema.default;
        } else {
          return boundOffset(Number(offset));
        }
      })(),

      order_by: (() => {
        return (orderBy as RequiredQueryParams['order_by']).filter((field) =>
          orderByFields.has(field)
        );
      })(),
      order_by_desc: (() => {
        return (orderByDesc as RequiredQueryParams['order_by_desc']).filter(
          (field) => orderByDescFields.has(field)
        );
      })(),
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
        if (Array.isArray(queryParams[key])) {
          queryParams[key].forEach((value) => {
            query.append(key, value.toString());
          });
        } else {
          query.set(key, queryParams[key].toString());
        }
      }
    }

    const newSearch = query.toString();
    if (newSearch !== location.search) {
      navigate({ search: newSearch });
    }
  }, [queryParams]);

  const [apiKeyCount, setApiKeyCount] = useState<ApiKeyCount>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [apiKeyIdIndex, setApiKeyIdIndex] = useState<ApiKey['id'][]>([]);
  const [apiKeyScopeIds, setApiKeyScopeIds] = useState<ApiKeyScopeIds>({});
  const [availableScopeIds, setAvailableScopeIds] = useState<ScopeId[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<SelectedIndex>(null);

  // show the available scopes based on the user's role
  useEffect(() => {
    if (authContext.state.user !== null) {
      const userRoleId = authContext.state.user.user_role_id;
      const userRoleName = config.userRoleIdMapping[userRoleId];

      if (userRoleName === undefined) {
        return;
      }

      const scopeNames = config.userRoleScopes[userRoleName];

      if (scopeNames === undefined) {
        return;
      }

      const scopeIds = scopeNames.map(
        (scopeName: string) => config.scopeNameMapping[scopeName]
      );

      if (scopeIds.includes(undefined)) {
        return;
      }

      setAvailableScopeIds(scopeIds as ScopeId[]);
    }
  });

  const { data, refetch, loading } = useApiCall(getApiKeysSettingsPage, []);

  const hasMounted = useRef(false);

  // refetch when limit, offset, orderBy, or orderByDesc changes
  useEffect(() => {
    if (hasMounted.current) {
      refetch();
    } else {
      hasMounted.current = true;
    }
  }, [queryParams]);

  // when data is fetched, update the states
  useEffect(() => {
    if (data !== undefined) {
      setApiKeys(() => {
        const keys = {} as ApiKeys;
        for (const apiKey of data.api_keys) {
          keys[apiKey.id] = apiKey;
        }
        return keys;
      });
      //   setApiKeyScopeIds(() => {
      //     const keys = {} as ApiKeyScopeIds;
      //     for (const apiKey of data.api_keys) {
      //       keys[apiKey.id] = new Set(apiKey.scope_ids);
      //     }
      //     return keys;
      //   });
      setApiKeyIdIndex((prev) => {
        const keys = [] as ApiKey['id'][];
        for (const apiKey of data.api_keys) {
          keys.push(apiKey.id);
        }
        return keys;
      });
      setApiKeyCount(data.api_key_count);
    }
  }, [data]);

  const addApiKeyScopeFunc: ModifyApiKeyScopeFunc = async (apiKey, scopeId) => {
    setApiKeyScopeIds((prev) => {
      const updatedSet = new Set(prev[apiKey.id]);
      updatedSet.add(scopeId);
      return {
        ...prev,
        [apiKey.id]: updatedSet,
      };
    });

    const { data, error } = updateAuthFromFetchResponse(
      await postApiKeyScope.request({
        params: {
          path: {
            api_key_id: apiKey.id,
            scope_id: scopeId,
          },
        },
      }),
      authContext
    );

    if (error !== undefined) {
      setApiKeyScopeIds((prev: ApiKeyScopeIds) => {
        const updatedSet = new Set(prev[apiKey.id]);
        updatedSet.delete(scopeId);
        return {
          ...prev,
          [apiKey.id]: updatedSet,
        };
      });
    }
  };

  const deleteApiKeyScopeFunc: ModifyApiKeyScopeFunc = async (
    apiKey,
    scopeId
  ) => {
    const scopeName = config.scopeIdMapping[scopeId];

    setApiKeyScopeIds((prev: ApiKeyScopeIds) => {
      const updatedSet = new Set(prev[apiKey.id]);
      updatedSet.delete(scopeId);
      return {
        ...prev,
        [apiKey.id]: updatedSet,
      };
    });

    const { data, error } = updateAuthFromFetchResponse(
      await deleteApiKeyScope.request({
        params: {
          path: {
            api_key_id: apiKey.id,
            scope_id: scopeId,
          },
        },
      }),
      authContext
    );

    if (error !== undefined) {
      setApiKeyScopeIds((prev: ApiKeyScopeIds) => {
        const updatedSet = new Set(prev[apiKey.id]);
        updatedSet.add(scopeId);
        return {
          ...prev,
          [apiKey.id]: updatedSet,
        };
      });
    }
  };

  const addApiKeyFunc: AddApiKeyFunc = async (apiKeyCreate) => {
    let toastId = toastContext.makePending({
      message: 'Creating API Key...',
    });

    const { data, error } = updateAuthFromFetchResponse(
      await postApiKey.request({
        body: apiKeyCreate,
      }),
      authContext
    );

    if (data !== undefined) {
      toastContext.update(toastId, {
        message: `Created API Key ${data.name}`,
        type: 'success',
      });
      refetch();
      return true;
    } else {
      toastContext.update(toastId, {
        message: `Error creating API Key`,
        type: 'error',
      });
      return false;
    }
  };

  const updateApiKeyFunc: UpdateApiKeyFunc = async (apiKeyId, apiKeyUpdate) => {
    let toastId = toastContext.makePending({
      message: 'Updating API Key...',
    });

    // optimistic update
    const apiKey = apiKeys[apiKeyId];
    if (apiKey === undefined) {
      console.error('Invalid API Key ID:', apiKeyId);
      return false;
    }

    setApiKeys((prev: ApiKeys) => {
      const updated = { ...prev };

      const originalApiKey = updated[apiKeyId];
      if (originalApiKey === undefined) {
        return updated;
      }

      updated[apiKeyId] = {
        ...originalApiKey,
        ...apiKeyUpdate,
      };

      return updated;
    });

    const { data } = updateAuthFromFetchResponse(
      await patchApiKey.request({
        params: {
          path: {
            api_key_id: apiKeyId,
          },
        },
        body: apiKeyUpdate,
      }),
      authContext
    );

    if (data !== undefined) {
      toastContext.update(toastId, {
        message: `Created API Key ${data.name}`,
        type: 'success',
      });
      refetch();
      return true;
    } else {
      toastContext.update(toastId, {
        message: 'Error creating API Key',
        type: 'error',
      });

      // revert optimistic update
      setApiKeys((prev: ApiKeys) => {
        const updated = { ...prev };
        updated[apiKeyId] = { ...apiKey };
        return updated;
      });

      return false;
    }
  };

  const deleteApiKeyFunc: DeleteApiKeyFunc = async (index) => {
    const apiKeyId = apiKeyIdIndex[index];
    if (apiKeyId === undefined) {
      console.error('Invalid API Key ID at index:', index);
      return false;
    }
    const apiKey = apiKeys[apiKeyId];
    if (apiKey === undefined) {
      console.error('Invalid API Key at index:', index);
      return false;
    }

    let toastId = toastContext.makePending({
      message: `Deleting API Key ${apiKey.name}`,
    });

    setApiKeyIdIndex((prev) => {
      const newApiKeyIdIndex = [...prev];
      newApiKeyIdIndex.splice(index, 1);
      return newApiKeyIdIndex;
    });
    setApiKeyCount((prev) => (prev === null ? null : prev - 1));

    const { data, error } = updateAuthFromFetchResponse(
      await deleteApiKey.request({
        params: {
          path: {
            api_key_id: apiKeyId,
          },
        },
      }),
      authContext
    );

    if (data !== undefined) {
      toastContext.update(toastId, {
        message: `Deleted API Key ${apiKey.name}`,
        type: 'success',
      });

      setApiKeys((prev) => {
        const updated = { ...prev };
        delete updated[apiKeyId];
        return updated;
      });

      refetch();
      return true;
    } else {
      toastContext.update(toastId, {
        message: `Error deleting API Key ${apiKey.name}`,
        type: 'error',
      });

      setApiKeyIdIndex((prev) => {
        const updated = [...prev];
        updated.splice(index, 0, apiKeyId);
        return updated;
      });
      setApiKeyCount((prev) => (prev === null ? null : prev + 1));

      return false;
    }
  };

  const selectedIndexRef = useRef(selectedIndex);
  const apiKeyViewFirstRenderRef = useRef(true);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null) {
      const apiKeyId = apiKeyIdIndex[selectedIndex];
      if (apiKeyId !== undefined) {
        const apiKey = apiKeys[apiKeyId];
        const scopeIds = apiKeyScopeIds[apiKeyId];
        if (apiKey !== undefined && scopeIds !== undefined) {
          if (apiKeyViewFirstRenderRef.current) {
            const modal: ModalType<ApiKeyViewProps> = {
              key: makeApiKeyModalViewKey(apiKeyId),
              Component: ApiKeyView,
              componentProps: {
                selectedIndex: selectedIndex,
                setSelectedIndex: setSelectedIndex,
                apiKey: apiKey,
                scopeIds: scopeIds,
                availableScopeIds,
                updateApiKeyFunc,
                deleteApiKeyScopeFunc,
                deleteApiKeyFunc,
                addApiKeyScopeFunc,
                authContext,
                modalsContext,
                activateButtonConfirmation,
              },
              contentAdditionalClassName: 'max-w-[400px] w-full',
              onExit: () => setSelectedIndex(null),
            };
            modalsContext.pushModals([modal]);
            apiKeyViewFirstRenderRef.current = false;
          } else {
            apiKeyViewFirstRenderRef.current = true;
          }
        }
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null && !apiKeyViewFirstRenderRef.current) {
      const apiKeyId = apiKeyIdIndex[selectedIndex];
      if (apiKeyId !== undefined) {
        const apiKey = apiKeys[apiKeyId];
        const scopeIds = apiKeyScopeIds[apiKeyId];
        if (apiKey !== undefined && scopeIds !== undefined) {
          const modal: ModalUpdateType<ApiKeyViewProps> = {
            key: makeApiKeyModalViewKey(apiKeyId),
            componentProps: {
              apiKey: apiKey,
              scopeIds: scopeIds,
              availableScopeIds,
            },
          };
          modalsContext.updateModals([modal]);
        }
      }
    }
  }, [apiKeys, apiKeyScopeIds, availableScopeIds]);

  if (authContext.state.user !== null) {
    return (
      <>
        <div className="flex flex-row space-x-4 mb-4">
          <h2>API Keys</h2>
        </div>
        <Card1>
          <div className="flex flex-row justify-between items-center space-x-2">
            <div className="flex flex-row items-center space-x-4">
              <Button1
                onClick={() => {
                  modalsContext.pushModals([
                    {
                      key: addApiKeyModalKey,
                      Component: AddApiKey,
                      componentProps: {
                        authContext,
                        addApiKeyFunc,
                        modalsContext,
                      },
                      contentAdditionalClassName: 'max-w-[350px] w-full',
                    },
                  ]);
                }}
              >
                Add API Key
              </Button1>
            </div>
            <Pagination
              loading={loading}
              offset={queryParams['offset']}
              setOffset={(offset: RequiredQueryParams['offset']) => {
                setQueryParams((prev) => ({
                  ...prev,
                  offset: boundOffset(offset),
                }));
              }}
              limit={queryParams['limit']}
              setLimit={(limit: RequiredQueryParams['limit']) => {
                setQueryParams((prev) => ({
                  ...prev,
                  limit: boundLimit(limit),
                }));
              }}
              count={apiKeyIdIndex.length}
              total={apiKeyCount}
            />
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full">
              <thead className="text-left">
                <tr>
                  {(
                    [
                      'name',
                      'issued',
                      'expiry',
                    ] as RequiredQueryParams['order_by']
                  ).map((field) => (
                    <th key={field}>
                      {(() => {
                        let orderByState: OrderByState = 'off';

                        // get index of field in orderBy
                        const orderByIndex =
                          queryParams['order_by'].indexOf(field);
                        if (orderByIndex !== -1) {
                          orderByState = 'asc';
                        }
                        const orderByDescIndex =
                          queryParams['order_by_desc'].indexOf(field);
                        if (orderByDescIndex !== -1) {
                          orderByState = 'desc';
                        }

                        return (
                          <>
                            {orderByFields.has(field) ? (
                              <div
                                className="flex flex-row items-center surface-hover cursor-pointer pl-2"
                                onClick={() => {
                                  if (orderByState === 'off') {
                                    setQueryParams((prev) => ({
                                      ...prev,
                                      order_by: [...prev.order_by, field],
                                    }));
                                  } else if (orderByState === 'asc') {
                                    setQueryParams((prev) => ({
                                      ...prev,
                                      order_by_desc: [
                                        ...prev.order_by_desc,
                                        field,
                                      ],
                                    }));
                                  } else if (orderByState === 'desc') {
                                    setQueryParams((prev) => {
                                      const updatedOrderBy =
                                        prev.order_by.filter(
                                          (item) => item !== field
                                        );
                                      const updatedOrderByDesc =
                                        prev.order_by_desc.filter(
                                          (item) => item !== field
                                        );
                                      return {
                                        ...prev,
                                        order_by: updatedOrderBy,
                                        order_by_desc: updatedOrderByDesc,
                                      };
                                    });
                                  }
                                }}
                              >
                                {field}
                                {orderByState === 'off' ? (
                                  <IoCaretForward />
                                ) : (
                                  <>
                                    {orderByState === 'asc' ? (
                                      <IoCaretDown />
                                    ) : (
                                      <IoCaretUp />
                                    )}
                                    {(() => {
                                      const index =
                                        queryParams['order_by'].indexOf(field);
                                      return index + 1;
                                    })()}
                                  </>
                                )}
                              </div>
                            ) : (
                              field
                            )}
                          </>
                        );
                      })()}
                    </th>
                  ))}
                  {availableScopeIds.map((scopeId) => (
                    <th key={scopeId}>{config.scopeIdMapping[scopeId]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiKeyIdIndex.map((apiKeyId, index) => {
                  const apiKey = apiKeys[apiKeyId];
                  const scopeIds = apiKeyScopeIds[apiKeyId];

                  if (apiKey === undefined || scopeIds === undefined) {
                    return null; // or return empty fragment
                  }

                  return (
                    <Surface key={apiKeyId}>
                      <tr
                        className="surface-hover cursor-pointer border-[1px]"
                        onClick={() => {
                          setSelectedIndex(index);
                        }}
                      >
                        <td className="px-2 py-1 truncate">{apiKey.name}</td>
                        <td className="px-2 py-1">
                          {new Date(apiKey.issued).toLocaleString()}
                        </td>
                        <td className="px-2 py-1">
                          {new Date(apiKey.expiry).toLocaleString()}
                        </td>
                        {availableScopeIds.map((scopeId) => (
                          <td key={scopeId} className="px-2 py-1">
                            <ApiKeyTableRowScope
                              scopeId={scopeId}
                              apiKey={apiKey}
                              scopeIds={scopeIds}
                              addApiKeyScopeFunc={addApiKeyScopeFunc}
                              deleteApiKeyScopeFunc={deleteApiKeyScopeFunc}
                            />
                          </td>
                        ))}
                      </tr>
                    </Surface>
                  );
                })}{' '}
              </tbody>
            </table>
          </div>
        </Card1>
      </>
    );
  } else {
    return null;
  }
}
