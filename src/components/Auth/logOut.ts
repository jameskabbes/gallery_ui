import { postLogOut } from '../../services/api-services/gallery';
import { AuthContextType, ToastContextType } from '../../types';
import { updateAuthFromFetchResponse } from '../../utils/api';

export async function logOut(
  authContext: AuthContextType,
  toastContext: ToastContextType
) {
  let toastId = toastContext.makePending({
    message: 'Logging out...',
  });
  const { response, data, error } = updateAuthFromFetchResponse(
    await postLogOut.request(),
    authContext
  );

  if (error === undefined) {
    authContext.logOut(toastId);
  } else {
    toastContext.update(toastId, {
      message: 'Error logging out',
      type: 'error',
    });
  }
}
