import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/Auth';
import { RequestOTPContext } from '../../contexts/RequestOTP';
import { AuthModalsContext } from '../../contexts/AuthModals';
import {
  AuthModalType,
  RequestOTPContextType,
  ValidatedInputState,
} from '../../types';
import { config } from '../../config/config';

import { defaultValidatedInputState } from '../../utils/useValidatedInput';

import {
  postLogInOTPPhoneNumber,
  postRequestOTPEmail,
  postRequestOTPSMS,
  postLogInOTPEmail,
} from '../../services/api-services/gallery';
import { Button2, ButtonSubmit } from '../Utils/Button';
import { isEmailValid } from '../../services/isEmailValid';
import { ValidatedInputString } from '../Form/ValidatedInputString';
import { ValidatedInputPhoneNumber } from '../Form/ValidatedInputPhoneNumber';
import { Surface } from '../Utils/Surface';
import { useValidatedInputString } from '../../utils/useValidatedInput';
import { Loader1 } from '../Utils/Loader';
import { IoLogInOutline, IoWarning } from 'react-icons/io5';
import { updateAuthFromFetchResponse } from '../../utils/api';

export function RequestOTP() {
  const authContext = useContext(AuthContext);
  const requestOTPContext = useContext(RequestOTPContext);
  const authModalsContext = useContext(AuthModalsContext);

  const mediums: RequestOTPContextType['medium'][] = ['email', 'sms'];

  useEffect(() => {
    if (requestOTPContext.medium === 'email') {
      requestOTPContext.setValid(requestOTPContext.email.status === 'valid');
    } else if (requestOTPContext.medium === 'sms') {
      requestOTPContext.setValid(
        requestOTPContext.phoneNumber.status === 'valid'
      );
    }
  }, [
    requestOTPContext.email.status,
    requestOTPContext.phoneNumber.status,
    requestOTPContext.medium,
  ]);

  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    authModalsContext.activate('verifyOTP');

    if (requestOTPContext.medium === 'email') {
      updateAuthFromFetchResponse(
        await postRequestOTPEmail.request({
          body: {
            email: requestOTPContext.email.value,
          },
        }),
        authContext
      );
    } else if (requestOTPContext.medium === 'sms') {
      updateAuthFromFetchResponse(
        await postRequestOTPSMS.request({
          body: {
            phone_number: requestOTPContext.phoneNumber.value,
          },
        }),
        authContext
      );
    }
  }

  return (
    <div id="otp" className="flex flex-col">
      <form onSubmit={handleSubmitRequest} className="flex flex-col space-y-6">
        <header>Send Code</header>
        <div className="flex flex-row space-x-2">
          {mediums.map((medium) => (
            <Button2
              type="button"
              key={medium}
              isActive={requestOTPContext.medium === medium}
              onClick={() => requestOTPContext.setMedium(medium)}
              className="flex-1"
            >
              {medium}
            </Button2>
          ))}
        </div>
        <fieldset className="flex flex-col space-y-6">
          <section className="space-y-2">
            {requestOTPContext.medium === 'email' ? (
              <>
                <label htmlFor="email">Email</label>
                <ValidatedInputString
                  state={requestOTPContext.email}
                  setState={requestOTPContext.setEmail}
                  id="request-otp-email"
                  minLength={
                    config.apiSchemas['gallery'].components.schemas
                      .LoginWithOTPEmailRequest.properties.email.minLength
                  }
                  maxLength={
                    config.apiSchemas['gallery'].components.schemas
                      .LoginWithOTPEmailRequest.properties.email.maxLength
                  }
                  type="email"
                  checkValidity={true}
                  showStatus={true}
                  isValid={isEmailValid}
                />
              </>
            ) : requestOTPContext.medium === 'sms' ? (
              <>
                <label htmlFor="phone">Phone Number</label>
                <ValidatedInputPhoneNumber
                  state={requestOTPContext.phoneNumber}
                  setState={requestOTPContext.setPhoneNumber}
                  id="request-otp-phone-number"
                  showStatus={true}
                />
              </>
            ) : null}
          </section>
        </fieldset>
        <span className="text-center mx-10">
          {`If an account with this ${
            requestOTPContext.medium === 'email'
              ? 'email address'
              : requestOTPContext.medium === 'sms'
              ? 'phone number'
              : null
          } exists, we will send you a code.`}
        </span>
        <ButtonSubmit disabled={!requestOTPContext.valid}>
          {requestOTPContext.medium === 'email'
            ? 'Send Email'
            : requestOTPContext.medium === 'sms'
            ? 'Send SMS'
            : null}
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
            authModalsContext.activate('logIn');
          }}
        >
          <h6 className="text-center mb-0 ">Login</h6>
          <IoLogInOutline className="absolute left-4 top-1/2 transform -translate-y-1/2" />{' '}
        </Button2>
      </div>
    </div>
  );
}

export function VerifyOTP() {
  const authModalsContext = useContext(AuthModalsContext);
  const authContext = useContext(AuthContext);
  const requestOTPContext = useContext(RequestOTPContext);

  const [code, setCode] = useState<ValidatedInputState<string>>({
    ...defaultValidatedInputState<string>(''),
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pattern = new RegExp(
    config.apiSchemas[
      'gallery'
    ].components.schemas.LoginWithOTPEmailRequest.properties.code.pattern
  );

  const nCharacters =
    config.apiSchemas['gallery'].components.schemas.LoginWithOTPEmailRequest
      .properties.code.maxLength;

  function setControlledCursorIndex(index: number, codeValueLength: number) {
    if (index < 0) {
      // min case
      setCursorIndex(0);
    } else if (index > nCharacters) {
      setCursorIndex(nCharacters);
    } else {
      setCursorIndex(index);
    }
  }

  useValidatedInputString({
    state: code,
    setState: setCode,
    checkValidity: true,
    minLength: nCharacters,
    maxLength: nCharacters,
    pattern:
      config.apiSchemas['gallery'].components.schemas.LoginWithOTPEmailRequest
        .properties.code.pattern,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorIndex, cursorIndex);
    }
  }, [cursorIndex]);

  // Check focus state on component render and updates
  useEffect(() => {
    const currentInput = inputRef.current;

    if (currentInput !== null) {
      const handleFocus = () => setIsFocused(true);
      const handleBlur = () => setIsFocused(false);
      currentInput.addEventListener('focus', handleFocus);
      currentInput.addEventListener('blur', handleBlur);

      return () => {
        currentInput.removeEventListener('focus', handleFocus);
        currentInput.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  useEffect(() => {
    setControlledCursorIndex(code.value.length, code.value.length);
    setError(null);
  }, [code.value]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    var valid = false;

    if (requestOTPContext.medium === 'email') {
      const { response } = updateAuthFromFetchResponse(
        await postLogInOTPEmail.request({
          body: {
            code: code.value,
            email: requestOTPContext.email.value,
          },
        }),
        authContext
      );
      if (response.ok) {
        valid = true;
      }
    } else if (requestOTPContext.medium === 'sms') {
      const { response } = updateAuthFromFetchResponse(
        await postLogInOTPPhoneNumber.request({
          body: {
            code: code.value,
            phone_number: requestOTPContext.phoneNumber.value,
          },
        }),
        authContext
      );
      if (response.ok) {
        valid = true;
      }
    }
    setLoading(false);
    if (valid) {
      authModalsContext.activate(null);
    } else {
      setCode((prev) => ({
        ...prev,
        status: 'invalid',
      }));
      setError('could not verify code');
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // filter out the non numbers

    const value = e.target.value.slice(0, nCharacters);

    // fill in remaining characters with the number 1 - assume the number 1 is safe
    const mockedValue = value + '1'.repeat(nCharacters - value.length);

    if (pattern.test(mockedValue)) {
      setCode((prev) => {
        return { ...prev, value };
      });
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <header>Verify Code</header>
      <div className="info-bar">
        {loading ? (
          <div className="flex flex-row justify-center items-center space-x-2">
            <Loader1 />
            <span className="mb-0">logging in</span>
          </div>
        ) : error ? (
          <div className="flex flex-row justify-center items-center space-x-2">
            <span className="rounded-full p-1 text-light leading-none bg-error-500">
              <IoWarning
                style={{
                  animation: 'scaleUp 0.2s ease-in-out',
                }}
              />
            </span>
            <span>{error}</span>
          </div>
        ) : null}
      </div>
      <Surface>
        <div
          className={`flex flex-row justify-between cursor-pointer p-4 rounded-xl border-[1px] hover:border-color-primary ${
            isFocused ? 'border-color-primary' : ''
          }`}
          onClick={handleContainerClick}
        >
          <input
            ref={inputRef}
            type="text"
            value={code.value}
            onChange={handleInputChange}
            className="opacity-0 absolute"
          />
          {Array.from({ length: nCharacters }).map((_, index) => (
            <div
              onClick={() => {
                setControlledCursorIndex(index, code.value.length);
              }}
              key={index}
              className={`flex-1 text-3xl text-center px-2`}
            >
              <Surface keepParentMode={true}>
                <div
                  className={`border-b-[1px] py-2 ${
                    index === cursorIndex && isFocused
                      ? 'border-primary-light dark:border-primary-dark'
                      : ''
                  }`}
                >
                  {code.value[index] || '*'}
                </div>
              </Surface>
            </div>
          ))}
        </div>
      </Surface>

      <ButtonSubmit disabled={code.status !== 'valid'}>
        Submit Code
      </ButtonSubmit>
    </form>
  );
}
