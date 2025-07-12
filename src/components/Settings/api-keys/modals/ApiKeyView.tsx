import { useEffect, useState } from 'react';
import { ApiKey, ApiKeyViewProps } from '../../../../types/gallery/types';
import { Button2 } from '../../../Utils/Button';
import { ApiKeyCodeModal } from './CodeModal';
import { config } from '../../../../config/config';
import { ApiKeyTableRowScope } from '../ApiKeyTableRowScope';
import { UpdateApiKey } from '../forms/UpdateApiKey';
import {
  IoArrowBack,
  IoArrowBackSharp,
  IoArrowForwardSharp,
} from 'react-icons/io5';

const deleteApiKeyModalKey = 'modal-confirmation-delete-api-key';
export const apiKeyViewModalKey = 'modal-api-key-view';

export function ApiKeyView({
  selectedIndex,
  apiKeyCount,
  setSelectedIndex,
  apiKey,
  scopeIds,
  availableScopeIds,
  updateApiKeyFunc,
  deleteApiKeyScopeFunc,
  addApiKeyScopeFunc,
  deleteApiKeyFunc,
  authContext,
  modalsContext,
  activateButtonConfirmation,
}: ApiKeyViewProps) {
  type Mode = 'code' | 'scopes' | 'edit';

  const modes: Mode[] = ['edit', 'scopes', 'code'];
  const [mode, setMode] = useState<Mode>(modes[0] || 'edit');

  const [leftDisabled, setLeftDisabled] = useState<boolean>(false);
  const [rightDisabled, setRightDisabled] = useState<boolean>(false);

  function checkLeftDisabled() {
    return selectedIndex === null || selectedIndex <= 0;
  }
  function checkRightDisabled() {
    return selectedIndex === null || selectedIndex >= apiKeyCount - 1;
  }

  useEffect(() => {
    setLeftDisabled(checkLeftDisabled());
    setRightDisabled(checkRightDisabled());
  }, [selectedIndex, apiKeyCount]);

  function handleLeftClick() {
    if (leftDisabled || selectedIndex === null) return;
    setSelectedIndex(selectedIndex - 1);
  }
  function handleRightClick() {
    if (rightDisabled || selectedIndex === null) return;
    setSelectedIndex(selectedIndex + 1);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        handleLeftClick();
      } else if (e.key === 'ArrowRight') {
        handleRightClick();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [leftDisabled, rightDisabled, selectedIndex, apiKeyCount]);

  return (
    <div className="flex flex-col space-y-4 mt-2">
      <div className="flex flex-row justify-between items-center space-x-4">
        <div className="overflow-x-auto overflow-y-clip">
          <h3 className="break-words">{apiKey.name}</h3>
        </div>
        <div className="flex flex-row items-center space-x-1">
          <span>
            {(selectedIndex ?? 0) + 1} of {apiKeyCount}
          </span>

          <button disabled={leftDisabled} onClick={handleLeftClick}>
            <IoArrowBackSharp className={leftDisabled ? 'opacity-50' : ''} />
          </button>
          <button disabled={rightDisabled} onClick={handleRightClick}>
            <IoArrowForwardSharp
              className={rightDisabled ? 'opacity-50' : ''}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-row space-x-2 overflow-x-auto">
        {modes.map((m) => (
          <Button2
            key={m}
            onClick={() => setMode(m)}
            className={`${
              mode === m ? ' border-primary-light dark:border-primary-dark' : ''
            } hover:border-primary-light dark:hover:border-primary-dark flex-1`}
          >
            {m}
          </Button2>
        ))}
        <Button2
          className="flex-1"
          onClick={() => {
            activateButtonConfirmation({
              key: deleteApiKeyModalKey,
              componentProps: {
                title: 'Delete API Key?',
                confirmText: 'Delete',
                message: `Are you sure you want to delete the API Key ${apiKey.name}?`,
                onConfirm: () => {
                  modalsContext.deleteModals([apiKeyViewModalKey]);
                  deleteApiKeyFunc(selectedIndex);
                  setSelectedIndex(null);
                },
              },
            });
          }}
        >
          <span className="text-red-500">delete</span>
        </Button2>
      </div>
      <div className="flex flex-col min-h-[300px] h-full overflow-y-scroll">
        {mode === 'code' ? (
          <ApiKeyCodeModal apiKeyId={apiKey.id} />
        ) : mode === 'scopes' ? (
          <>
            {(() => {
              console.log(scopeIds);
              return availableScopeIds.map((scopeId) => (
                <div
                  className="flex flex-row items-center space-x-2"
                  key={scopeId}
                >
                  <ApiKeyTableRowScope
                    scopeId={scopeId}
                    apiKey={apiKey}
                    scopeIds={scopeIds}
                    addApiKeyScopeFunc={addApiKeyScopeFunc}
                    deleteApiKeyScopeFunc={deleteApiKeyScopeFunc}
                  />
                  <span>{config.scopeIdMapping[scopeId]}</span>
                </div>
              ));
            })()}{' '}
          </>
        ) : mode === 'edit' ? (
          <UpdateApiKey
            apiKey={apiKey}
            authContext={authContext}
            updateApiKeyFunc={updateApiKeyFunc}
          />
        ) : null}
      </div>
    </div>
  );
}
