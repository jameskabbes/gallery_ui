import React, { useContext, useState } from 'react';
import { deleteMe } from '../../services/api-services/gallery';
import {
  AuthContextType,
  ModalsContextType,
  ToastContextType,
} from '../../types';
import { useConfirmationModal } from '../../utils/useConfirmationModal';
import { updateAuthFromFetchResponse } from '../../utils/api';

interface Props {
  activateTextConfirmation: ReturnType<
    typeof useConfirmationModal
  >['activateTextConfirmation'];
  authContext: AuthContextType;
  toastContext: ToastContextType;
  modalsContext: ModalsContextType;
}

const modalKey = 'modal-confirmation-delete-account';

export function setDeleteAccountModal({
  activateTextConfirmation,
  authContext,
  toastContext,
  modalsContext,
}: Props) {
  async function handleDeleteMe() {
    const toastId = toastContext.makePending({
      message: 'Deleting account...',
    });

    const { data, response } = await updateAuthFromFetchResponse(
      await deleteMe.request(),
      authContext
    );

    if (response.ok) {
      toastContext.update(toastId, {
        message: 'Account deleted',
        type: 'success',
      });
      authContext.logOut();
    } else {
      toastContext.update(toastId, {
        message: 'Error deleting account',
        type: 'error',
      });
    }
  }

  activateTextConfirmation({
    key: modalKey,
    componentProps: {
      title: 'Delete Account?',
      message: (
        <p>
          This operation will delete your account and all your data.{' '}
          <strong>This cannot be undone. </strong>
        </p>
      ),
      target: 'delete',
      onConfirm: () => handleDeleteMe(),
    },
  });
}
