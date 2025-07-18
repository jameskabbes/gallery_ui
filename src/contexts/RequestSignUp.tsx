import React, { useEffect, useState, useReducer, createContext } from 'react';
import { RequestSignUpContextType } from '../types';
import { defaultValidatedInputState } from '../utils/useValidatedInput';

export const RequestSignUpContext = createContext<RequestSignUpContextType>({
  email: {
    ...defaultValidatedInputState<RequestSignUpContextType['email']['value']>(
      ''
    ),
  },
  setEmail: () => {},
  valid: false,
  setValid: () => {},
  loading: false,
  setLoading: () => {},
});

export function RequestSignUpContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState<RequestSignUpContextType['email']>({
    ...defaultValidatedInputState<RequestSignUpContextType['email']['value']>(
      ''
    ),
  });
  const [valid, setValid] = useState<RequestSignUpContextType['valid']>(false);
  const [loading, setLoading] =
    useState<RequestSignUpContextType['loading']>(false);

  return (
    <RequestSignUpContext.Provider
      value={{
        email,
        setEmail,
        valid,
        setValid,
        loading,
        setLoading,
      }}
    >
      {children}
    </RequestSignUpContext.Provider>
  );
}
