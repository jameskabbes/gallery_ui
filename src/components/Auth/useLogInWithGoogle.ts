import { useGoogleLogin } from '@react-oauth/google';
import { postLogInGoogle } from '../../services/apiServices';
import { useContext } from 'react';
import { ToastContext } from '../../contexts/Toast';
import { AuthContext } from '../../contexts/Auth';
import { AuthModalsContext } from '../../contexts/AuthModals';
import { updateAuthFromFetchResponse } from '../../utils/api';

export function useLogInWithGoogle() {
  const toastContext = useContext(ToastContext);
  const authContext = useContext(AuthContext);
  const authModalsContext = useContext(AuthModalsContext);

  return useGoogleLogin({
    onSuccess: async (res) => {
      const toastId = toastContext.makePending({
        message: 'Logging in with Google...',
      });

      const { data, response } = updateAuthFromFetchResponse(
        await postLogInGoogle({
          body: {
            id_token: res.access_token,
          },
        }),
        authContext
      );

      if (response.ok) {
        toastContext.update(toastId, {
          message: 'Logged in with Google',
          type: 'success',
        });
        authModalsContext.activate(null);
      } else {
        toastContext.update(toastId, {
          message: 'Could not log in with Google',
          type: 'error',
        });
      }
    },
  });
}
