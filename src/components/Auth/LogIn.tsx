import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/Auth';
import { config } from '../../config/config';
import { ValidatedInputString } from '../Form/ValidatedInputString';
import { LogInContext } from '../../contexts/LogIn';
import { ToastContext } from '../../contexts/Toast';
import { AuthModalsContext } from '../../contexts/AuthModals';
import {
  IoWarning,
  IoPersonAddSharp,
  IoColorWand,
  IoPhonePortraitOutline,
} from 'react-icons/io5';
import { ValidatedInputCheckbox } from '../Form/ValidatedInputCheckbox';
import { Button2, ButtonSubmit } from '../Utils/Button';
import { Loader1, Loader2 } from '../Utils/Loader';
import { Surface } from '../Utils/Surface';
import { postLogInPassword } from '../../services/api-services/gallery';
import { ModalsContext } from '../../contexts/Modals';
import { AuthModalType } from '../../types';
import { useLogInWithGoogle } from './useLogInWithGoogle';
import { ValidatedInputToggle } from '../Form/ValidatedInputToggle';
import { updateAuthFromFetchResponse } from '../../utils/api';

export function LogIn() {
  const logInContext = useContext(LogInContext);
  const authContext = useContext(AuthContext);
  const authModalsContext = useContext(AuthModalsContext);
  const modalsContext = useContext(ModalsContext);
  const toastContext = useContext(ToastContext);
  const logInWithGoogle = useLogInWithGoogle();

  const key: AuthModalType = 'logIn';

  useEffect(() => {
    logInContext.setError(null);
  }, [logInContext.username.value, logInContext.password.value]);

  useEffect(() => {
    if (logInContext.loading) {
      logInContext.setError(null);
    }
  }, [logInContext.loading]);

  useEffect(() => {
    logInContext.setValid(
      logInContext.username.status === 'valid' &&
        logInContext.password.status === 'valid' &&
        !logInContext.loading
    );
  }, [
    logInContext.username.status,
    logInContext.password.status,
    logInContext.loading,
  ]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (logInContext.valid) {
      logInContext.setLoading(true);

      const { data, error, response } = updateAuthFromFetchResponse(
        await postLogInPassword.request({
          body: {
            username: logInContext.username.value,
            password: logInContext.password.value,
            stay_signed_in: logInContext.staySignedIn.value,
            scope: '',
          },
        }),
        authContext
      );

      logInContext.setLoading(false);

      if (data !== undefined) {
        modalsContext.deleteModals([key]);
        toastContext.make({
          message: `Welcome ${
            data.auth.user !== null
              ? data.auth.user.username ?? data.auth.user.email
              : ''
          }`,
          type: 'success',
        });
      } else if (error !== undefined) {
        console.log(error);
        logInContext.setError('could not log in');
      } else {
        logInContext.setError('Could not log in');
      }
    }
  }

  return (
    <div className="flex" id="login">
      <div className="flex-1">
        <form onSubmit={handleLogin} className="flex flex-col space-y-6">
          <header>Login</header>
          <div className="info-bar">
            {logInContext.loading ? (
              <div className="flex flex-row justify-center items-center space-x-2">
                <Loader1 />
                <span className="mb-0">logging in</span>
              </div>
            ) : logInContext.error ? (
              <div className="flex flex-row justify-center items-center space-x-2">
                <span className="rounded-full p-1 text-light leading-none bg-error-500">
                  <IoWarning
                    style={{
                      animation: 'scaleUp 0.2s ease-in-out',
                    }}
                  />
                </span>
                <span>{logInContext.error}</span>
              </div>
            ) : null}
          </div>

          <fieldset className="flex flex-col space-y-4">
            <section className="space-y-2">
              <label htmlFor="login-username">Username or Email</label>
              <ValidatedInputString
                state={logInContext.username}
                setState={logInContext.setUsername}
                id="login-username"
                minLength={1}
                maxLength={Math.max(
                  config.apiSchemas['gallery'].components.schemas
                    .UserAdminCreate.properties.email.maxLength,
                  config.apiSchemas['gallery'].components.schemas
                    .UserAdminCreate.properties.username.anyOf[0]?.maxLength ??
                    0
                )}
                type="text"
                checkValidity={true}
                showStatus={true}
              />
            </section>
            <section className="space-y-2">
              <div className="flex flex-row items-center justify-between">
                <label htmlFor="login-password">Password</label>
                <span
                  onClick={() => authModalsContext.activate('requestMagicLink')}
                  className="underline cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>

              <ValidatedInputString
                state={logInContext.password}
                setState={logInContext.setPassword}
                id="login-password"
                minLength={
                  config.apiSchemas['gallery'].components.schemas
                    .UserAdminCreate.properties.password.anyOf[0]?.minLength
                }
                maxLength={
                  config.apiSchemas['gallery'].components.schemas
                    .UserAdminCreate.properties.password.anyOf[0]?.maxLength
                }
                type="password"
                checkValidity={true}
                showStatus={true}
              />
            </section>
            <section className="flex flex-row items-center justify-center space-x-2">
              <ValidatedInputToggle
                state={logInContext.staySignedIn}
                setState={logInContext.setStaySignedIn}
                toggleProps={{
                  type: 'button',
                }}
                inputProps={{
                  id: 'login-stay-signed-in',
                }}
              />
              <label htmlFor="login-stay-signed-in">Remember Me</label>
            </section>
          </fieldset>

          <ButtonSubmit type="submit" disabled={!logInContext.valid}>
            Login
          </ButtonSubmit>
        </form>
        <Surface keepParentMode={true}>
          <div className="flex flex-row items-center space-x-2 my-2">
            <div className="flex-1 border-inherit border-t-[1px]" />
            <p>or</p>
            <div className="flex-1 border-inherit border-t-[1px]" />
          </div>
        </Surface>

        <div className="space-y-1">
          <Button2
            className="w-full relative"
            onClick={() => {
              logInWithGoogle();
            }}
          >
            <h6 className="text-center mb-0 ">Login with Google</h6>
            <img
              src="/google_g_logo.svg"
              alt="google_logo"
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ width: '1rem', height: '1rem' }}
            />
          </Button2>

          <Button2
            className="w-full relative"
            onClick={() => {
              authModalsContext.activate('requestSignUp');
            }}
          >
            <h6 className="text-center mb-0 ">Sign Up</h6>
            <IoPersonAddSharp className="absolute left-4 top-1/2 transform -translate-y-1/2" />
          </Button2>

          <Button2
            className="w-full relative"
            onClick={() => {
              authModalsContext.activate('requestMagicLink');
            }}
          >
            <h6 className="text-center mb-0 ">Login with Magic Link</h6>
            <IoColorWand className="absolute left-4 top-1/2 transform -translate-y-1/2" />
          </Button2>
          <Button2
            className="w-full relative"
            onClick={() => {
              authModalsContext.activate('requestOTP');
            }}
          >
            <h6 className="text-center mb-0 ">Login with Code</h6>
            <IoPhonePortraitOutline className="absolute left-4 top-1/2 transform -translate-y-1/2" />
          </Button2>
        </div>
      </div>
    </div>
  );
}
