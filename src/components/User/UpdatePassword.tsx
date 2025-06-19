import React, { useEffect, useState, useContext } from 'react';
import { ValidatedInputString } from '../Form/ValidatedInputString';
import { ValidatedInputState } from '../../types';
import { defaultValidatedInputState } from '../../utils/useValidatedInput';
import { config } from '../../config/config';
import { AuthContext } from '../../contexts/Auth';
import { components } from '../../gallery_api_schema_client';
import { ToastContext } from '../../contexts/Toast';
import { patchMe } from '../../services/api-services/gallery';
import { Button1 } from '../Utils/Button';
import { isPasswordValid } from '../../services/isPasswordValid';
import { updateAuthFromFetchResponse } from '../../utils/api';

export function UpdatePassword() {
  const [password, setPassword] = useState<ValidatedInputState<string>>({
    ...defaultValidatedInputState<string>(''),
  });
  const [confirmPassword, setConfirmPassword] = useState<
    ValidatedInputState<string>
  >({
    ...defaultValidatedInputState<string>(''),
  });
  const [valid, setValid] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    setValid(password.status === 'valid' && confirmPassword.status === 'valid');
  }, [password.status, confirmPassword.status]);

  useEffect(() => {
    if (password.status !== 'valid') {
      setConfirmPassword((prev) => ({
        ...prev,
        status: 'invalid',
        message: 'Password is invalid',
      }));
    } else if (password.value !== confirmPassword.value) {
      setConfirmPassword((prev) => ({
        ...prev,
        status: 'invalid',
        message: 'Passwords do not match',
      }));
    } else {
      setConfirmPassword((prev) => ({
        ...prev,
        status: 'valid',
      }));
    }
  }, [confirmPassword.value, password]);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (valid && authContext.state.user !== null) {
      let toastId = toastContext.makePending({
        message: 'Updating password...',
      });

      const { data, response } = updateAuthFromFetchResponse(
        await patchMe.request({
          body: {
            password: password.value,
          },
        }),
        authContext
      );

      if (response.ok) {
        setPassword({ ...defaultValidatedInputState<string>('') });
        setConfirmPassword({ ...defaultValidatedInputState<string>('') });
        toastContext.update(toastId, {
          message: 'Updated password',
          type: 'success',
        });
      } else {
        toastContext.update(toastId, {
          message: 'Error updating password',
          type: 'error',
        });
      }
    }
  }

  return (
    <form onSubmit={handleUpdatePassword} className="flex flex-col space-y-2">
      <div>
        <label htmlFor="password">Password</label>
        <ValidatedInputString
          state={password}
          setState={setPassword}
          id="password"
          minLength={
            config.apiSchemas['gallery'].components.schemas.UserUpdate
              .properties.password.anyOf[0]?.minLength
          }
          maxLength={
            config.apiSchemas['gallery'].components.schemas.UserUpdate
              .properties.password.anyOf[0]?.maxLength
          }
          type="password"
          isValid={isPasswordValid}
          checkValidity={true}
          showStatus={password.value !== '' || confirmPassword.value !== ''}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <ValidatedInputString
          state={confirmPassword}
          setState={setConfirmPassword}
          id="confirmPassword"
          type="password"
          checkValidity={true}
          showStatus={password.value !== '' || confirmPassword.value !== ''}
        />
      </div>
      <Button1 type="submit" disabled={!valid}>
        Update Password
      </Button1>
    </form>
  );
}
