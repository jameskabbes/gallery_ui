import { paths } from '../gallery_api_schema_client';
import { galleryClient } from '../utils/apiClient';
import { ApiService } from '../types';
import { HttpMethod, PathsWithMethod } from 'openapi-typescript-helpers';
// Auth

function createApiService<
  TMethod extends HttpMethod,
  TPath extends PathsWithMethod<paths, TMethod>
>(method: TMethod, url: TPath): ApiService<TMethod, TPath> {
  return async (...init) => {
    return galleryClient.request(method, url, ...init);
  };
}

export const getAuth = createApiService('get', '/auth/');

export const postLogInPassword = createApiService(
  'post',
  '/auth/login/password/'
);
export const postLogInGoogle = createApiService('post', '/auth/login/google/');

export const postLogInMagicLink = createApiService(
  'post',
  '/auth/login/magic-link/'
);

export const postLogInOTPEmail = createApiService(
  'post',
  '/auth/login/otp/email/'
);

export const postLogInOTPPhoneNumber = createApiService(
  'post',
  '/auth/login/otp/phone_number/'
);

export const postSignUp = createApiService('post', '/auth/signup/');

export const postLogOut = createApiService('post', '/auth/logout/');

export const postRequestMagicLinkEmail = createApiService(
  'post',
  '/auth/request/magic-link/email/'
);

export const postRequestMagicLinkSMS = createApiService(
  'post',
  '/auth/request/magic-link/sms/'
);

export const postRequestOTPEmail = createApiService(
  'post',
  '/auth/request/otp/email/'
);

export const postRequestOTPSMS = createApiService(
  'post',
  '/auth/request/otp/sms/'
);

export const postRequestSignUp = createApiService(
  'post',
  '/auth/request/signup/'
);

// User

export const patchMe = createApiService('patch', '/users/me/');

export const getMe = createApiService('get', '/users/me/');

export const deleteMe = createApiService('delete', '/users/me/');

export const getIsUserUsernameAvailable = createApiService(
  'get',
  '/users/available/username/{username}/'
);

// User Access Tokens

export const getUserAccessTokens = createApiService(
  'get',
  '/user-access-tokens/'
);

export const deleteUserAccessToken = createApiService(
  'delete',
  '/user-access-tokens/{user_access_token_id}/'
);

// Api Keys
export const getApiKey = createApiService('get', '/api-keys/{api_key_id}/');

export const getApiKeys = createApiService('get', '/api-keys/');

export const postApiKey = createApiService('post', '/api-keys/');

export const patchApiKey = createApiService('patch', '/api-keys/{api_key_id}/');

export const deleteApiKey = createApiService(
  'delete',
  '/api-keys/{api_key_id}/'
);

export const getIsApiKeyAvailable = createApiService(
  'get',
  '/api-keys/details/available/'
);

export const getApiKeyJwt = createApiService(
  'get',
  '/api-keys/{api_key_id}/generate-jwt/'
);

// Api Key Scope
export const postApiKeyScope = createApiService(
  'post',
  '/api-key-scopes/api-keys/{api_key_id}/scopes/{scope_id}/'
);

export const deleteApiKeyScope = createApiService(
  'delete',
  '/api-key-scopes/api-keys/{api_key_id}/scopes/{scope_id}/'
);

// Gallery
export const postGallery = createApiService('post', '/galleries/');

export const patchGallery = createApiService(
  'patch',
  '/galleries/{gallery_id}/'
);

export const deleteGallery = createApiService(
  'delete',
  '/galleries/{gallery_id}/'
);

export const getIsGalleryAvailable = createApiService(
  'get',
  '/galleries/details/available/'
);

export const postGallerySync = createApiService(
  'post',
  '/galleries/{gallery_id}/sync/'
);

// export const postGalleryFile = createApiService(
//   'post',
//   '/galleries/{gallery_id}/upload/'
// );

// pages

export const getHomePage = createApiService('get', '/pages/home/');

export const getStylesPage = createApiService('get', '/pages/styles/');

export const getSettingsPage = createApiService('get', '/pages/settings/');

export const getApiKeysSettingsPage = createApiService(
  'get',
  '/pages/settings/api-keys/'
);

export const getUserAccessTokensSettingsPage = createApiService(
  'get',
  '/pages/settings/user-access-tokens/'
);

export const getGalleryPage = createApiService(
  'get',
  '/pages/galleries/{gallery_id}/'
);
