interface ApiKeyViewProps {
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  apiKey: TApiKey;
  scopeIds: Set<ScopeID>;
  availableScopeIds: ScopeID[];
  updateApiKeyFunc: TUpdateApiKeyFunc;
  deleteApiKeyScopeFunc: TModifyApiKeyScopeFunc;
  addApiKeyScopeFunc: TModifyApiKeyScopeFunc;
  deleteApiKeyFunc: TDeleteApiKeyFunc;
  authContext: AuthContextType;
  modalsContext: ModalsContextType;
  activateButtonConfirmation: ReturnType<
    typeof useConfirmationModal
  >['activateButtonConfirmation'];
}

function makeApiKeyModalViewKey(id: TApiKey['id']): string {
  return `modal-api-key-view-${id}`;
}

function ApiKeyView({
  selectedIndex,
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
  const [mode, setMode] = useState<Mode>(modes[0]);

  return (
    <div className="flex flex-col space-y-4 mt-2">
      <div className="flex flex-row justify-between items-center space-x-4">
        <div className="overflow-x-auto overflow-y-clip">
          <h3 className="break-words">{apiKey.name}</h3>
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
                  modalsContext.deleteModals([
                    makeApiKeyModalViewKey(apiKey.id),
                  ]);
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
          <ApiKeyCodeModal apiKey={apiKey} authContext={authContext} />
        ) : mode === 'scopes' ? (
          <>
            {availableScopeIds.map((scopeId) => (
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
            ))}
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

interface ApiKeysProps {
  authContext: AuthContextType;
  toastContext: ToastContextType;
}
