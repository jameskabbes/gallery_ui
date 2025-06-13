import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { config } from '../config/config';

export function LogInWithGoogleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
