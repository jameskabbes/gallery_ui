import React, { useEffect, useState, useContext } from 'react';
import { config } from '../../config/config';
import { AuthContext } from '../../contexts/Auth';
import { ToastContext } from '../../contexts/Toast';
import { components } from '../../types/gallery/api_schema_client';
import {
  patchMe,
  getIsApiKeyAvailable,
  getIsUserUsernameAvailable,
} from '../../services/api-services/gallery';
import { ValidatedInputState } from '../../types';
import { defaultValidatedInputState } from '../../utils/useValidatedInput';
import { ValidatedInputString } from '../Form/ValidatedInputString';
import { Button1, Button2 } from '../Utils/Button';
import { useConfirmationModal } from '../../utils/useConfirmationModal';
import { updateAuthFromFetchResponse } from '../../utils/api';
import { start } from 'repl';

interface Props {
  user: components['schemas']['UserPrivate'];
}

export function UpdateUsername({ user }: Props) {
  const [startingUsername, setStartingUsername] = useState<
    Props['user']['username']
  >(user.username === null ? '' : user.username);

  const [username, setUsername] = useState<ValidatedInputState<string>>({
    ...defaultValidatedInputState<string>(startingUsername ?? ''),
  });
  const [valid, setValid] = useState<boolean>(false);
  const [modified, setModified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);
  const { activateButtonConfirmation } = useConfirmationModal();

  useEffect(() => {
    setValid(username.status === 'valid' && modified);
  }, [username.status, modified]);

  useEffect(() => {
    setModified(username.value !== startingUsername);
  }, [username.value, loading]);

  async function updateUsername(
    username: components['schemas']['UserUpdate']['username']
  ) {
    setLoading(true);
    let toastId = toastContext.makePending({
      message: 'Updating username...',
    });

    const { data, response } = updateAuthFromFetchResponse(
      await patchMe.request({
        body: {
          username: username,
        },
      }),
      authContext
    );

    setLoading(false);

    if (response.ok) {
      setStartingUsername(username ? username : '');
      toastContext.update(toastId, {
        message: 'Updated username',
        type: 'success',
      });
    } else {
      toastContext.update(toastId, {
        message: 'Error updating username',
        type: 'error',
      });
    }
  }

  async function handleUpdateUsername(e: React.FormEvent) {
    e.preventDefault();
    if (valid && authContext.state.user !== null) {
      await updateUsername(username.value);
    }
  }

  async function isUsernameAvailable() {
    const { data } = await getIsUserUsernameAvailable.request({
      params: {
        path: {
          username: username.value,
        },
      },
    });
    if (data === undefined) {
      return false;
    } else {
      return data.available;
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <form onSubmit={handleUpdateUsername} className="flex flex-col space-y-2">
        <div>
          <label htmlFor="username">Username</label>
          <ValidatedInputString
            state={username}
            setState={setUsername}
            id="username"
            type="text"
            minLength={
              config.apiSchemas['gallery'].components.schemas.UserUpdate
                .properties.username.anyOf[0]?.minLength
            }
            maxLength={
              config.apiSchemas['gallery'].components.schemas.UserUpdate
                .properties.username.anyOf[0]?.maxLength
            }
            checkValidity={true}
            checkAvailability={true}
            isAvailable={async (value) => {
              if (value === startingUsername) {
                return true;
              } else {
                return await isUsernameAvailable();
              }
            }}
            showStatus={modified}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <Button2
            className="flex-1"
            onClick={(e) => {
              setUsername({
                ...defaultValidatedInputState<string>(startingUsername ?? ''),
              });
            }}
            disabled={!modified}
          >
            Cancel
          </Button2>
          <Button1 type="submit" className="flex-1" disabled={!valid}>
            Update Username
          </Button1>
        </div>
      </form>
      {startingUsername !== '' && (
        <div className="flex flex-row justify-center">
          <Button1
            onClick={() =>
              activateButtonConfirmation({
                componentProps: {
                  title: 'Make Account Private?',
                  message:
                    'This will action will make your account private. Are you sure you want to continue?',
                  confirmText: 'Make Account Private',
                  onConfirm: async () => {
                    setUsername((prev) => {
                      return {
                        ...prev,
                        value: '',
                        status: 'valid',
                      };
                    });
                    await updateUsername(null);
                  },
                },
              })
            }
          >
            Make Account Private
          </Button1>
        </div>
      )}
    </div>
  );
}
