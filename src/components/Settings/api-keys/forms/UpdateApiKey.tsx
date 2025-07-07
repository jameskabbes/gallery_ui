interface UpdateApiKeyProps {
  authContext: AuthContextType;
  apiKey: TApiKey;
  updateApiKeyFunc: TUpdateApiKeyFunc;
}

function UpdateApiKey({
  authContext,
  apiKey,
  updateApiKeyFunc,
}: UpdateApiKeyProps) {
  interface ValidatedApiKeyAvailable {
    name: ValidatedInputState<string>;
    expiry: ValidatedInputState<Date | null>;
  }

  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<ValidatedInputState<string>>({
    ...defaultValidatedInputState<string>(apiKey.name),
  });
  const [nameModified, setNameModified] = useState<boolean>(false);
  const [expiry, setExpiry] = useState<ValidatedInputState<Date | null>>({
    ...defaultValidatedInputState<Date | null>(new Date(apiKey.expiry)),
  });
  const [expiryModified, setExpiryModified] = useState<boolean>(false);
  const [modified, setModified] = useState<boolean>(false);

  const [updateApiKeyInputStatus, setUpdateApiKeyInputStatus] =
    useState<ValidatedInputState<any>['status']>(null);

  useEffect(() => {
    setNameModified(apiKey.name !== name.value);
  }, [name.value, apiKey]);

  useEffect(() => {
    setExpiryModified(
      expiry.value === null
        ? true
        : new Date(apiKey.expiry).getTime() !== new Date(expiry.value).getTime()
    );
  }, [expiry.value, apiKey]);

  useEffect(() => {
    setModified(nameModified || expiryModified);
  }, [nameModified, expiryModified]);

  useEffect(() => {
    setUpdateApiKeyInputStatus((prev) =>
      name.status === 'invalid' || expiry.status === 'invalid'
        ? 'invalid'
        : name.status === 'loading' || expiry.status === 'loading'
        ? 'loading'
        : 'valid'
    );
  }, [name, expiry]);

  return (
    <form
      id="update-api-key"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);

        const apiKeyUpdate = {};
        if (nameModified) {
          apiKeyUpdate['name'] = name.value;
        }
        if (expiryModified) {
          apiKeyUpdate['expiry'] = new Date(expiry.value).toISOString();
        }
        if (await updateApiKeyFunc(apiKey.id, apiKeyUpdate)) {
        }
        setLoading(false);
      }}
      className="flex flex-col h-full"
    >
      <fieldset className="flex flex-col space-y-4">
        <section className="space-y-2">
          <label htmlFor="api-key-name">Name</label>
          <ValidatedInputString
            state={name}
            setState={setName}
            id="api-key-name"
            type="text"
            isAvailable={async (name) => {
              if (name === apiKey.name) {
                return true;
              } else {
                const { status } = await getIsApiKeyAvailable.request({
                  authContext,
                  params: {
                    name: name,
                  },
                });
                if (status === 200) {
                  return true;
                } else {
                  return false;
                }
              }
            }}
            checkAvailability={true}
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
            showStatus={nameModified}
          />
        </section>
        <section className="space-y-2">
          <label htmlFor="api-key-expiry">Expiry</label>
          <ValidatedInputDatetimeLocal
            state={expiry}
            setState={setExpiry}
            id="api-key-expiry"
            required={true}
            showStatus={expiryModified}
          />
        </section>
      </fieldset>
      <div className="h-[4rem] flex flex-row justify-center space-x-2 items-center">
        {loading ? (
          <Loader1 />
        ) : modified ? (
          <>
            <CheckOrX status={updateApiKeyInputStatus} />
            <p className="text-center">
              {updateApiKeyInputStatus === 'valid'
                ? 'Available'
                : updateApiKeyInputStatus === 'loading'
                ? 'Checking'
                : updateApiKeyInputStatus === 'invalid'
                ? 'Not available'
                : 'error'}
            </p>
          </>
        ) : null}
      </div>
      <div className="flex flex-row space-x-4">
        <Button2
          className="flex-1"
          disabled={!modified}
          onClick={(e) => {
            e.preventDefault();
            setName({
              ...defaultValidatedInputState<string>(apiKey.name),
            });
            setExpiry({
              ...defaultValidatedInputState<Date>(new Date(apiKey.expiry)),
            });
          }}
        >
          Cancel
        </Button2>
        <Button1
          className="flex-1"
          disabled={updateApiKeyInputStatus !== 'valid' || !modified || loading}
          type="submit"
        >
          Submit
        </Button1>
      </div>
    </form>
  );
}
