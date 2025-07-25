import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  paths,
  operations,
  components,
} from '../../types/gallery/api_schema_client';

import {
  postSignUp,
  postRequestSignUp,
} from '../../services/api-services/gallery';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { config } from '../../config/config';

import { RequestSignUpContext } from '../../contexts/RequestSignUp';
import { AuthContext } from '../../contexts/Auth';
import { AuthModalsContext } from '../../contexts/AuthModals';
import { ToastContext } from '../../contexts/Toast';

import { isEmailValid } from '../../services/isEmailValid';
import { ValidatedInputString } from '../Form/ValidatedInputString';
import { ValidatedInputCheckbox } from '../Form/ValidatedInputCheckbox';
import { IoLogInOutline, IoWarning } from 'react-icons/io5';
import { Button2, ButtonSubmit } from '../Utils/Button';
import { Loader1, Loader3 } from '../Utils/Loader';
import { ModalsContext } from '../../contexts/Modals';
import { Surface } from '../Utils/Surface';
import { useLogInWithGoogle } from './useLogInWithGoogle';
import { Card1 } from '../Utils/Card';
import { updateAuthFromFetchResponse, useApiCall } from '../../utils/api';

const checkInboxModalKey = 'modal-signup-check-inbox';

function CheckInbox() {
  const modalsContext = useContext(ModalsContext);
  const requestSignUpContext = useContext(RequestSignUpContext);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        modalsContext.deleteModals([checkInboxModalKey]);
      }}
      className="flex flex-col space-y-6"
    >
      <header>Check your inbox</header>
      <div className="flex flex-row justify-center">
        <Card1 className="p-4 overflow-x-auto">
          <code>{requestSignUpContext.email.value}</code>
        </Card1>
      </div>
      <p className="text-center">
        Follow the link sent to your inbox to get started.
      </p>
      <ButtonSubmit type="submit">Okay!</ButtonSubmit>
    </form>
  );
}

export function RequestSignUp() {
  const requestSignUpContext = useContext(RequestSignUpContext);
  const authContext = useContext(AuthContext);
  const authModalsContext = useContext(AuthModalsContext);
  const modalsContext = useContext(ModalsContext);
  const logInWithGoogle = useLogInWithGoogle();

  useEffect(() => {
    requestSignUpContext.setValid(
      requestSignUpContext.email.status === 'valid' &&
        !requestSignUpContext.loading
    );
  }, [requestSignUpContext.email, requestSignUpContext.loading]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (requestSignUpContext.valid) {
      modalsContext.swapActiveModal({
        Component: CheckInbox,
        key: checkInboxModalKey,
        componentProps: { modalsContext },
        contentAdditionalClassName: 'max-w-[400px] w-full',
      });

      requestSignUpContext.setLoading(true);

      const {} = updateAuthFromFetchResponse(
        await postRequestSignUp.request({
          body: {
            email: requestSignUpContext.email.value,
          },
        }),
        authContext
      );

      requestSignUpContext.setLoading(false);
    }
  }

  return (
    <div id="sign-up">
      <div className="flex">
        <div className="flex-1">
          <form onSubmit={handleSignUp} className="flex flex-col space-y-6">
            <header>Sign Up</header>
            <p className="text-center">To get started, enter your email.</p>
            <fieldset className="flex flex-col space-y-4">
              <section className="space-y-2">
                <label htmlFor="sign-up-email">Email</label>
                <ValidatedInputString
                  state={requestSignUpContext.email}
                  setState={requestSignUpContext.setEmail}
                  id="sign-up-email"
                  minLength={
                    config.apiSchemas['gallery'].components.schemas
                      .RequestSignUpEmailRequest.properties.email.minLength
                  }
                  maxLength={
                    config.apiSchemas['gallery'].components.schemas
                      .RequestSignUpEmailRequest.properties.email.maxLength
                  }
                  type="email"
                  checkValidity={true}
                  isValid={isEmailValid}
                  showStatus={true}
                />
              </section>
            </fieldset>

            <ButtonSubmit disabled={!requestSignUpContext.valid}>
              Sign Up
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
                authModalsContext.activate('logIn');
              }}
            >
              <h6 className="text-center mb-0 ">Login</h6>
              <IoLogInOutline className="absolute left-4 top-1/2 transform -translate-y-1/2" />{' '}
            </Button2>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VerifySignUp() {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [token, setToken] = useState<
    Parameters<typeof postSignUp>['0']['body']['token'] | null
  >(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setToken(new URLSearchParams(location.search).get('token'));
  }, [location.search]);

  useEffect(() => {
    async function verifySignUp() {
      const { data, response } = updateAuthFromFetchResponse(
        await postSignUp.request({
          body: {
            token: token === null ? '' : token,
          },
        }),
        authContext
      );
      navigate({ search: '' });
      if (response.ok) {
        setSuccess(true);
      }
      authContext.updateFromApiResponse(data);
    }
    if (token) {
      verifySignUp();
    }
  }, [token]);

  return (
    <div>
      {success === true ? (
        <h1>Success</h1>
      ) : success === null ? (
        <Loader1 />
      ) : (
        <h1>Error</h1>
      )}
    </div>
  );
}
