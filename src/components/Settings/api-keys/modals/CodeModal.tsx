import { useEffect, useState } from 'react';
import { getApiKeyJwt } from '../../../../services/api-services/gallery';
import { components as galleryComponents } from '../../../../types/gallery/api_schema_client';
import { useApiCall } from '../../../../utils/api';
import { Card1 } from '../../../Utils/Card';
import { Loader1 } from '../../../Utils/Loader';
import { Button1 } from '../../../Utils/Button';

interface ApiKeyCodeModalProps {
  apiKeyId: galleryComponents['schemas']['ApiKeyPrivate']['id'];
}

export function ApiKeyCodeModal({ apiKeyId }: ApiKeyCodeModalProps) {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const { data, loading, error } = useApiCall(getApiKeyJwt, [apiKeyId], {
    params: {
      path: {
        api_key_id: apiKeyId,
      },
    },
  });

  useEffect(() => {
    if (copySuccess) {
      const timeout = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copySuccess]);

  function copyCode() {
    if (data !== undefined) {
      navigator.clipboard.writeText(data.jwt).then(
        () => {
          setCopySuccess(true);
        },
        (err) => {
          console.error('Failed to copy text: ', err);
        }
      );
    }
  }

  return (
    <div
      id="api-key-code"
      className="flex flex-col flex-1 justify-between space-y-2"
    >
      <Card1
        onClick={() => copyCode()}
        className="hover:border-primary-light dark:hover:border-primary-dark cursor-pointer"
      >
        {loading ? (
          <Loader1 />
        ) : data !== undefined ? (
          <code className="break-words">{data.jwt}</code>
        ) : error !== undefined ? (
          <p>Error generating code</p>
        ) : null}
      </Card1>
      <div className="flex flex-col space-y-4 ">
        <p className="text-center h-4">
          {copySuccess ? 'Copied to clipboard' : null}
        </p>
        <Button1 onClick={() => copyCode()} disabled={loading}>
          Copy Code
        </Button1>
      </div>
    </div>
  );
}
