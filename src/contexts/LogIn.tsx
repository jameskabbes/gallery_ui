import React, { useEffect, useState, useReducer, createContext } from 'react';
import { LogInContextType } from '../types';
import { defaultValidatedInputState } from '../utils/useValidatedInput';

export const LogInContext = createContext<LogInContextType>({
  username: {
    ...defaultValidatedInputState<LogInContextType['username']['value']>(''),
  },
  setUsername: () => {},
  password: {
    ...defaultValidatedInputState<LogInContextType['password']['value']>(''),
  },
  setPassword: () => {},
  staySignedIn: {
    ...defaultValidatedInputState<LogInContextType['staySignedIn']['value']>(
      false
    ),
  },
  setStaySignedIn: () => {},
  valid: false,
  setValid: () => {},
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {},
});

export function LogInContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState<LogInContextType['username']>({
    ...defaultValidatedInputState<LogInContextType['username']['value']>(''),
  });
  const [password, setPassword] = useState<LogInContextType['password']>({
    ...defaultValidatedInputState<LogInContextType['username']['value']>(''),
  });
  const [staySignedIn, setStaySignedIn] = useState<
    LogInContextType['staySignedIn']
  >({
    ...defaultValidatedInputState<LogInContextType['staySignedIn']['value']>(
      false
    ),
  });
  const [valid, setValid] = useState<LogInContextType['valid']>(false);
  const [loading, setLoading] = useState<LogInContextType['loading']>(false);
  const [error, setError] = useState<LogInContextType['error']>(null);

  return (
    <LogInContext.Provider
      value={{
        username,
        setUsername,
        password,
        setPassword,
        staySignedIn,
        setStaySignedIn,
        valid,
        setValid,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </LogInContext.Provider>
  );
}
