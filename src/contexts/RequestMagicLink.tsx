import React, { useEffect, useState, useReducer, createContext } from 'react';
import { RequestMagicLinkContextType } from '../types';
import { defaultValidatedInputState } from '../utils/useValidatedInput';
import { E164Number } from 'libphonenumber-js';

export const RequestMagicLinkContext =
  createContext<RequestMagicLinkContextType>({
    medium: 'email',
    setMedium: () => {},
    email: {
      ...defaultValidatedInputState<
        RequestMagicLinkContextType['email']['value']
      >(''),
    },
    setEmail: () => {},
    phoneNumber: {
      ...defaultValidatedInputState<
        RequestMagicLinkContextType['phoneNumber']['value']
      >('' as E164Number),
    },
    setPhoneNumber: () => {},
    valid: false,
    setValid: () => {},
    loading: false,
    setLoading: () => {},
  });

export function RequestMagicLinkContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [medium, setMedium] =
    useState<RequestMagicLinkContextType['medium']>('email');
  const [email, setEmail] = useState<RequestMagicLinkContextType['email']>({
    ...defaultValidatedInputState<
      RequestMagicLinkContextType['email']['value']
    >(''),
  });
  const [phoneNumber, setPhoneNumber] = useState<
    RequestMagicLinkContextType['phoneNumber']
  >({
    ...defaultValidatedInputState<
      RequestMagicLinkContextType['phoneNumber']['value']
    >('' as E164Number),
  });
  const [valid, setValid] =
    useState<RequestMagicLinkContextType['valid']>(false);
  const [loading, setLoading] =
    useState<RequestMagicLinkContextType['loading']>(false);

  return (
    <RequestMagicLinkContext.Provider
      value={{
        medium,
        setMedium,
        email,
        setEmail,
        phoneNumber,
        setPhoneNumber,
        valid,
        setValid,
        loading,
        setLoading,
      }}
    >
      {children}
    </RequestMagicLinkContext.Provider>
  );
}
