interface ApiKeyTableRowScopeProps {
  scopeId: ScopeID;
  apiKey: TApiKey;
  scopeIds: Set<ScopeID>;
  deleteApiKeyScopeFunc: TModifyApiKeyScopeFunc;
  addApiKeyScopeFunc: TModifyApiKeyScopeFunc;
}

function ApiKeyTableRowScope({
  scopeId,
  apiKey,
  scopeIds,
  addApiKeyScopeFunc,
  deleteApiKeyScopeFunc,
}: ApiKeyTableRowScopeProps) {
  const debounceTimeout = useRef(null);
  const [debouncedState, setDebouncedState] = useState(scopeIds.has(scopeId));

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (scopeIds.has(scopeId) !== debouncedState) {
      debounceTimeout.current = setTimeout(async () => {
        if (debouncedState) {
          addApiKeyScopeFunc(apiKey, scopeId);
        } else {
          deleteApiKeyScopeFunc(apiKey, scopeId);
        }
      }, 500);
    }
  }, [debouncedState, scopeIds, scopeId]);

  return (
    <Toggle1
      onClick={async (e) => {
        e.stopPropagation();
        setDebouncedState((prev) => !prev);
      }}
      state={debouncedState}
    />
  );
}
