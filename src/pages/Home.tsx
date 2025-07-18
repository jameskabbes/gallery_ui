import React, { useEffect, useContext, useState } from 'react';
import { DeviceContext } from '../contexts/Device';
import {
  paths,
  operations,
  components,
} from '../types/gallery/api_schema_client';
import { ValidatedInputState } from '../types';
import { defaultValidatedInputState } from '../utils/useValidatedInput';
import { useApiCall } from '../utils/api';
import { Button1, Button2 } from '../components/Utils/Button';
import { AuthModalsContext } from '../contexts/AuthModals';
import { FileUploader } from '../components/Gallery/FileUploader';

import { Link } from 'react-router-dom';
import { getHomePage } from '../services/api-services/gallery';
import { AuthContext } from '../contexts/Auth';

export function Home() {
  const authModalsContext = useContext(AuthModalsContext);
  const authContext = useContext(AuthContext);

  const { data } = useApiCall(getHomePage, []);
  return (
    <>
      <div>
        <Link to="/styles/">
          <Button1>Styles</Button1>
        </Link>
      </div>
    </>
  );
}
