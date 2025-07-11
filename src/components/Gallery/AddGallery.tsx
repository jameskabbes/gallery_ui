import React, { useContext, useState, useEffect } from 'react';
import { ModalsContextType, ValidatedInputState } from '../../types';
import {
  paths,
  operations,
  components,
} from '../../types/gallery/api_schema_client';
import {
  postGallery,
  getIsGalleryAvailable,
} from '../../services/api-services/gallery';
import { defaultValidatedInputState } from '../../utils/useValidatedInput';

import { AuthContext } from '../../contexts/Auth';
import { ToastContext } from '../../contexts/Toast';
import { ValidatedInputString } from '../Form/ValidatedInputString';
import { ButtonSubmit } from '../Utils/Button';
import { RadioButton1 } from '../Utils/RadioButton';
import { useValidatedInput } from '../../utils/useValidatedInput';
import { CheckOrX } from '../Form/CheckOrX';
import { config } from '../../config/config';
import { updateAuthFromFetchResponse } from '../../utils/api';

interface AddGalleryProps {
  onSuccess: (gallery: components['schemas']['GalleryPublic']) => void;
  modalsContext: ModalsContextType;
  parentGalleryId: components['schemas']['GalleryPublic']['id'];
}

const addGalleryModalKey = 'modal-add-gallery';

export function AddGallery({
  onSuccess,
  modalsContext,
  parentGalleryId,
}: AddGalleryProps) {
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);

  const [name, setName] = useState<ValidatedInputState<string>>({
    ...defaultValidatedInputState<string>(''),
  });

  const [date, setDate] = useState<ValidatedInputState<string>>(
    defaultValidatedInputState<string>('')
  );

  const [visibilityLevelName, setVisibilityLevelName] = useState<
    ValidatedInputState<string>
  >({
    ...defaultValidatedInputState<string>('private'),
  });

  interface ValidatedGalleryAvailable {
    name: ValidatedInputState<string>;
    date: ValidatedInputState<string>;
  }

  const [galleryAvailable, setGalleryAvailable] = useState<
    ValidatedInputState<ValidatedGalleryAvailable>
  >({
    ...defaultValidatedInputState<ValidatedGalleryAvailable>({
      date: date,
      name: name,
    }),
  });

  useValidatedInput<ValidatedGalleryAvailable>({
    state: galleryAvailable,
    setState: setGalleryAvailable,
    checkAvailability: true,
    checkValidity: true,
    isAvailable: async () => {
      const { data, response } = updateAuthFromFetchResponse(
        await getIsGalleryAvailable.request({
          params: {
            query: {
              name: name.value,
              parent_id: parentGalleryId,
              ...(date.value !== '' && { date: date.value }),
            },
          },
        }),
        authContext
      );

      return response.ok === true;
    },
    isValid: (value) => {
      return value.date.status === 'valid' && value.name.status === 'valid'
        ? { valid: true }
        : { valid: false, message: 'Invalid entries' };
    },
  });

  useEffect(() => {
    setGalleryAvailable((prev) => ({
      ...prev,
      value: {
        date: date,
        name: name,
        parentGalleryId: parentGalleryId,
      },
    }));
  }, [name, parentGalleryId, date]);

  async function addGallery(event: React.FormEvent) {
    event.preventDefault();

    const toastId = toastContext.makePending({
      message: 'Adding gallery...',
    });

    modalsContext.deleteModals([addGalleryModalKey]);

    const visibilityLevel =
      config.visibilityLevelNameMapping[visibilityLevelName.value];

    if (visibilityLevel !== undefined) {
      const { data, response } = updateAuthFromFetchResponse(
        await postGallery.request({
          body: {
            name: name.value,
            parent_id: parentGalleryId,
            visibility_level: visibilityLevel,
            ...(date.value !== '' && { date: date.value }),
          },
        }),
        authContext
      );

      if (response.ok && data !== undefined) {
        toastContext.update(toastId, {
          message: 'Gallery added',
          type: 'success',
        });
        onSuccess(data);
      } else {
        toastContext.update(toastId, {
          message: 'Error adding gallery',
          type: 'error',
        });
      }
    }
  }

  return (
    <div id="add-gallery">
      <form onSubmit={addGallery} className="flex flex-col space-y-4">
        <header>Add Gallery</header>
        <fieldset className="flex flex-col space-y-4">
          <section>
            <label htmlFor="gallery-name">Name</label>
            <ValidatedInputString
              state={name}
              setState={setName}
              id="gallery-name"
              type="text"
              minLength={
                config.apiSchemas['gallery'].components.schemas.GalleryCreate
                  .properties.name.minLength
              }
              maxLength={
                config.apiSchemas['gallery'].components.schemas.GalleryCreate
                  .properties.name.maxLength
              }
              pattern={
                config.apiSchemas['gallery'].components.schemas.GalleryCreate
                  .properties.name.pattern
              }
              required={true}
              checkValidity={true}
              showStatus={true}
            />
          </section>
          <section>
            <label htmlFor="gallery-date">Date</label>
            <ValidatedInputString
              state={date}
              setState={setDate}
              type="date"
              id="gallery-date"
              showStatus={true}
            />
          </section>
          <section>
            <label>
              <legend>Visibility</legend>
            </label>
            <fieldset className="flex flex-row justify-around">
              {Object.keys(config.visibilityLevelNameMapping).map(
                (levelName) => (
                  <div
                    key={levelName}
                    className="flex flex-row items-center space-x-1"
                    onClick={() => {
                      setVisibilityLevelName((prev) => ({
                        ...prev,
                        value: levelName,
                      }));
                    }}
                  >
                    <RadioButton1
                      state={visibilityLevelName.value == levelName}
                    >
                      <input
                        id={`gallery-visibility-level-${levelName}`}
                        type="radio"
                        name="gallery-visibility-level"
                        className="opacity-0 absolute h-0 w-0 inset-0"
                        value={levelName}
                        onChange={() =>
                          setVisibilityLevelName({
                            ...visibilityLevelName,
                            value: levelName,
                          })
                        }
                      />
                    </RadioButton1>
                    <label htmlFor={`gallery-visibility-level-${levelName}`}>
                      {levelName}
                    </label>
                  </div>
                )
              )}
            </fieldset>
          </section>
        </fieldset>
        <div className="flex flex-row justify-center space-x-2 items-center">
          <p className="text-center">
            {galleryAvailable.status === 'valid'
              ? 'Available'
              : galleryAvailable.status === 'loading'
              ? 'Checking'
              : 'Not available'}
          </p>
          <CheckOrX status={galleryAvailable.status} />
        </div>

        <ButtonSubmit disabled={galleryAvailable.status !== 'valid'}>
          Add Gallery
        </ButtonSubmit>
      </form>
    </div>
  );
}

interface SetAddGalleryModalProps extends AddGalleryProps {}

export function setAddGalleryModal({
  modalsContext,
  ...rest
}: SetAddGalleryModalProps) {
  modalsContext.pushModals([
    {
      Component: AddGallery,
      componentProps: { modalsContext, ...rest },
      key: addGalleryModalKey,
      contentAdditionalClassName: 'max-w-[400px] w-full',
    },
  ]);
}
