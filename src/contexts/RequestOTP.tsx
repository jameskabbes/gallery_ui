import React, { createContext, useState } from 'react';

import { RequestOTPContextType } from '../types';
import { defaultValidatedInputState } from '../utils/useValidatedInput';
import { E164Number } from 'libphonenumber-js';

export const RequestOTPContext = createContext<RequestOTPContextType>({
  medium: 'email',
  setMedium: () => {},
  email: {
    ...defaultValidatedInputState<RequestOTPContextType['email']['value']>(''),
  },
  setEmail: () => {},
  phoneNumber: {
    ...defaultValidatedInputState<
      RequestOTPContextType['phoneNumber']['value']
    >('' as E164Number),
  },
  setPhoneNumber: () => {},
  valid: false,
  setValid: () => {},
});

interface Props {
  children: React.ReactNode;
}

export function RequestOTPContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [medium, setMedium] =
    useState<RequestOTPContextType['medium']>('email');
  const [email, setEmail] = useState<RequestOTPContextType['email']>({
    ...defaultValidatedInputState<RequestOTPContextType['email']['value']>(''),
  });
  const [phoneNumber, setPhoneNumber] = useState<
    RequestOTPContextType['phoneNumber']
  >({
    ...defaultValidatedInputState<
      RequestOTPContextType['phoneNumber']['value']
    >('' as E164Number),
  });
  const [valid, setValid] = useState<RequestOTPContextType['valid']>(false);

  return (
    <RequestOTPContext.Provider
      value={{
        medium,
        setMedium,
        email,
        setEmail,
        phoneNumber,
        setPhoneNumber,
        valid,
        setValid,
      }}
    >
      {children}
    </RequestOTPContext.Provider>
  );
}
