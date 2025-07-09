import { useEffect, useRef, useState } from 'react';
import { ScopeId } from '../../../types';
import { ApiKey, ModifyApiKeyScopeFunc } from '../../../types/gallery/types';
import { Toggle1 } from '../../Utils/Toggle';

interface ApiKeyTableRowScopeProps {
  scopeId: ScopeId;
  apiKey: ApiKey;
  scopeIds: Set<ScopeId>;
  deleteApiKeyScopeFunc: ModifyApiKeyScopeFunc;
  addApiKeyScopeFunc: ModifyApiKeyScopeFunc;
}

export function ApiKeyTableRowScope({
  scopeId,
  apiKey,
  scopeIds,
  addApiKeyScopeFunc,
  deleteApiKeyScopeFunc,
}: ApiKeyTableRowScopeProps) {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
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
