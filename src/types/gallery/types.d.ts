import { paths, operations, components } from './api_schema_client';
import {
  getApiKeyJwt,
  patchApiKey,
  postApiKey,
} from '../../services/api-services/gallery';
import { ScopeId } from '../../types';

export type ApiKey = components['schemas']['ApiKeyPrivate'];
export type ApiKeys = Record<ApiKey['id'], ApiKey>;
export type ApiKeyScopeIds = {
  [key: ApiKey['id']]: Set<ScopeId>;
};

export type Jwt = NonNullable<
  Awaited<ReturnType<typeof getApiKeyJwt.request>>['data']
>['jwt'];

export type ModifyApiKeyScopeFunc = (
  apiKey: ApiKey,
  scopeId: ScopeId
) => Promise<void>;

export type AddApiKeyFunc = (
  apiKeyCreate: Parameters<typeof postApiKey.request>['0']['body']
) => Promise<boolean>;
export type DeleteApiKeyFunc = (index: number) => Promise<boolean>;
export type UpdateApiKeyFunc = (
  apiKeyId: ApiKey['id'],
  apiKeyUpdate: Parameters<typeof patchApiKey.request>['0']['body']
) => Promise<boolean>;

export type ApiKeyCount = number | null;
export type SelectedIndex = number | null;

export interface ApiKeyViewProps {
  selectedIndex: SelectedIndex;
  setSelectedIndex: React.Dispatch<React.SetStateAction<SelectedIndex>>;
  apiKey: ApiKey;
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
