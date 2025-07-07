import React, { useEffect, useState, useContext } from 'react';
import {
  paths,
  operations,
  components,
} from '../../types/gallery/api_schema_client';
import { config } from '../../config/config';
import { AuthContext } from '../../contexts/Auth';
import { ToastContext } from '../../contexts/Toast';
import { isEmailValid } from '../../services/isEmailValid';
import { ValidatedInputState } from '../../types';
import { defaultValidatedInputState } from '../../utils/useValidatedInput';
import { patchMe } from '../../services/api-services/gallery';
import { ValidatedInputString } from '../Form/ValidatedInputString';
import { Button1, Button2, ButtonSubmit } from '../Utils/Button';
import { updateAuthFromFetchResponse } from '../../utils/api';

interface Props {
  user: components['schemas']['UserPrivate'];
}

export function UpdateEmail({ user }: Props) {
  const [startingEmail, setStartingEmail] = useState<string>(user.email);
  const [email, setEmail] = useState<ValidatedInputState<string>>({
    ...defaultValidatedInputState<string>(user.email),
  });
  const [valid, setValid] = useState<boolean>(false);
  const [modified, setModified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    setValid(email.status === 'valid' && modified);
  }, [email.status, modified]);

  useEffect(() => {
    setModified(email.value !== startingEmail);
  }, [email.value, loading]);

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    if (valid && authContext.state.user !== null) {
      setLoading(true);
      let toastId = toastContext.makePending({
        message: 'Updating email...',
      });

      const { data, response } = updateAuthFromFetchResponse(
        await patchMe.request({
          body: {
            email: email.value,
          },
        }),
        authContext
      );

      setLoading(false);

      if (response.ok) {
        setStartingEmail(email.value);
        toastContext.update(toastId, {
          message: 'Updated user',
          type: 'success',
        });
      } else {
        toastContext.update(toastId, {
          message: 'Error updating user',
          type: 'error',
        });
      }
    }
  }

  return (
    <form onSubmit={handleUpdateEmail} className="flex flex-col space-y-2">
      <div>
        <label htmlFor="email">Email</label>
        <div className="flex-1">
          <ValidatedInputString
            state={email}
            setState={setEmail}
            id="email"
            type="email"
            minLength={
              config.apiSchemas['gallery'].components.schemas.UserUpdate
                .properties.email.anyOf[0]?.minLength
            }
            maxLength={
              config.apiSchemas['gallery'].components.schemas.UserUpdate
                .properties.email.anyOf[0]?.maxLength
            }
            checkValidity={true}
            isValid={isEmailValid}
            required={true}
            showStatus={modified}
          />
        </div>
      </div>
      <div className="flex flex-row space-x-2">
        <Button2
          onClick={(e) => {
            e.preventDefault();
            setEmail({
              ...defaultValidatedInputState<string>(startingEmail),
            });
          }}
          disabled={!modified}
          className="flex-1"
        >
          Cancel
        </Button2>
        <Button1 type="submit" disabled={!valid} className="flex-1">
          Update Email
        </Button1>
      </div>
    </form>
  );
}
