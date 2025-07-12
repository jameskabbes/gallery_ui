import { useEffect, useState } from 'react';

import { AuthContextType, ModalsContextType } from '../../../../types';
import { ValidatedInputState } from '../../../../types';
import { defaultValidatedInputState } from '../../../../utils/useValidatedInput';
import { useValidatedInput } from '../../../../utils/useValidatedInput';
import { ValidatedInputString } from '../../../Form/ValidatedInputString';
import { ValidatedInputDatetimeLocal } from '../../../Form/ValidatedInputDatetimeLocal';
import { config } from '../../../../config/config';
import { ButtonSubmit } from '../../../Utils/Button';
import { CheckOrX } from '../../../Form/CheckOrX';
import { getIsApiKeyAvailable } from '../../../../services/api-services/gallery';
import { AddApiKeyFunc } from '../../../../types/gallery/types';

interface AddApiKeyProps {
  authContext: AuthContextType;
  addApiKeyFunc: AddApiKeyFunc;
  modalsContext: ModalsContextType;
}

export const addApiKeyModalKey = 'modal-add-api-key';

export function AddApiKey({
  authContext,
  addApiKeyFunc,
  modalsContext,
}: AddApiKeyProps) {
  interface ValidatedApiKeyAvailable {
    name: ValidatedInputState<string>;
  }

  const [name, setName] = useState<ValidatedInputState<string>>({
    ...defaultValidatedInputState<string>(''),
  });
  const [expiry, setExpiry] = useState<ValidatedInputState<Date | null>>({
    ...defaultValidatedInputState<Date | null>(
      new Date(new Date().setMonth(new Date().getMonth() + 1))
    ),
  });

  const [apiKeyAvailable, setApiKeyAvailable] = useState<
    ValidatedInputState<ValidatedApiKeyAvailable>
  >({
    ...defaultValidatedInputState<ValidatedApiKeyAvailable>({
      name: name,
    }),
  });

  useValidatedInput<ValidatedApiKeyAvailable>({
    state: apiKeyAvailable,
    setState: setApiKeyAvailable,
    checkAvailability: true,
    checkValidity: true,
    isAvailable: async (state) => {
      const { response, data } = await getIsApiKeyAvailable.request({
        params: {
          query: {
            name: state.name.value,
          },
        },
      });
      if (response.ok && data !== undefined) {
        return data.available;
      } else {
        return false;
      }
    },
    isValid: (value) => {
      return value.name.status === 'valid'
        ? { valid: true }
        : { valid: false, message: 'Invalid name' };
    },
  });

  useEffect(() => {
    setApiKeyAvailable((prev) => ({
      ...prev,
      value: {
        name: name,
      },
    }));
  }, [name]);

  return (
    <div id="add-api-key">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (expiry.value !== null) {
            if (
              await addApiKeyFunc({
                expiry: new Date(expiry.value).toISOString(),
                name: name.value,
              })
            ) {
              modalsContext.deleteModals([addApiKeyModalKey]);
            }
          }
        }}
        className="flex flex-col space-y-4"
      >
        <header>Add API Key</header>
        <fieldset className="flex flex-col space-y-4">
          <section>
            <label htmlFor="api-key-name">Name</label>
            <ValidatedInputString
              state={name}
              setState={setName}
              id="api-key-name"
              type="text"
              minLength={
                config.apiSchemas['gallery'].components.schemas.ApiKeyCreate
                  .properties.name.minLength
              }
              maxLength={
                config.apiSchemas['gallery'].components.schemas.ApiKeyCreate
                  .properties.name.maxLength
              }
              required={true}
              checkValidity={true}
              showStatus={true}
            />
          </section>
          <section>
            <label htmlFor="api-key-expiry">Expiry</label>
            <ValidatedInputDatetimeLocal
              state={expiry}
              setState={setExpiry}
              id="api-key-expiry"
              required={true}
              showStatus={true}
            />
          </section>
        </fieldset>

        <div className="flex flex-row justify-center space-x-2 items-center">
          <p className="text-center">
            {apiKeyAvailable.status === 'valid'
              ? 'Available'
              : apiKeyAvailable.status === 'loading'
              ? 'Checking'
              : 'Not available'}
          </p>
          <CheckOrX status={apiKeyAvailable.status} />
        </div>

        <ButtonSubmit disabled={apiKeyAvailable.status !== 'valid'}>
          Add API Key
        </ButtonSubmit>
      </form>
    </div>
  );
}
