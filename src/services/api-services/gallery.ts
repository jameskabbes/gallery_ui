import { paths } from '../../gallery_api_schema_client';
import { config } from '../../config/config';
import { galleryClient } from '../../utils/apiClient';
import { createApiServiceFactory } from '.';
import { GalleryApiSchema } from '../../gallery_api_schema';
import { ApiSchemaParameter } from '../../types';
// Auth

const createGalleryService = createApiServiceFactory<paths, GalleryApiSchema>(
  config.apiSchemas['gallery'],
  galleryClient
);

export const getAuth = createGalleryService('get', '/auth/');

export const postLogInPassword = createGalleryService(
  'post',
  '/auth/login/password/'
);
export const postLogInGoogle = createGalleryService(
  'post',
  '/auth/login/google/'
);

export const postLogInMagicLink = createGalleryService(
  'post',
  '/auth/login/magic-link/'
);

export const postLogInOTPEmail = createGalleryService(
  'post',
  '/auth/login/otp/email/'
);

export const postLogInOTPPhoneNumber = createGalleryService(
  'post',
  '/auth/login/otp/phone_number/'
);

export const postSignUp = createGalleryService('post', '/auth/signup/');

export const postLogOut = createGalleryService('post', '/auth/logout/');

export const postRequestMagicLinkEmail = createGalleryService(
  'post',
  '/auth/request/magic-link/email/'
);

export const postRequestMagicLinkSMS = createGalleryService(
  'post',
  '/auth/request/magic-link/sms/'
);

export const postRequestOTPEmail = createGalleryService(
  'post',
  '/auth/request/otp/email/'
);

export const postRequestOTPSMS = createGalleryService(
  'post',
  '/auth/request/otp/sms/'
);

export const postRequestSignUp = createGalleryService(
  'post',
  '/auth/request/signup/'
);

// User

export const patchMe = createGalleryService('patch', '/users/me/');

export const getMe = createGalleryService('get', '/users/me/');

export const deleteMe = createGalleryService('delete', '/users/me/');

export const getIsUserUsernameAvailable = createGalleryService(
  'get',
  '/users/available/username/{username}/'
);

// User Access Tokens

export const getUserAccessTokens = createGalleryService(
  'get',
  '/user-access-tokens/'
);

export const deleteUserAccessToken = createGalleryService(
  'delete',
  '/user-access-tokens/{user_access_token_id}/'
);

// Api Keys
export const getApiKey = createGalleryService('get', '/api-keys/{api_key_id}/');

export const getApiKeys = createGalleryService('get', '/api-keys/');

export const postApiKey = createGalleryService('post', '/api-keys/');

export const patchApiKey = createGalleryService(
  'patch',
  '/api-keys/{api_key_id}/'
);

export const deleteApiKey = createGalleryService(
  'delete',
  '/api-keys/{api_key_id}/'
);

export const getIsApiKeyAvailable = createGalleryService(
  'get',
  '/api-keys/details/available/'
);

export const getApiKeyJwt = createGalleryService(
  'get',
  '/api-keys/{api_key_id}/generate-jwt/'
);

// Api Key Scope
export const postApiKeyScope = createGalleryService(
  'post',
  '/api-key-scopes/api-keys/{api_key_id}/scopes/{scope_id}/'
);

export const deleteApiKeyScope = createGalleryService(
  'delete',
  '/api-key-scopes/api-keys/{api_key_id}/scopes/{scope_id}/'
);

// Gallery
export const postGallery = createGalleryService('post', '/galleries/');

export const patchGallery = createGalleryService(
  'patch',
  '/galleries/{gallery_id}/'
);

export const deleteGallery = createGalleryService(
  'delete',
  '/galleries/{gallery_id}/'
);

export const getIsGalleryAvailable = createGalleryService(
  'get',
  '/galleries/details/available/'
);

export const postGallerySync = createGalleryService(
  'post',
  '/galleries/{gallery_id}/sync/'
);

// export const postGalleryFile = createGalleryService(
//   'post',
//   '/galleries/{gallery_id}/upload/'
// );

// pages

export const getHomePage = createGalleryService('get', '/pages/home/');

export const getStylesPage = createGalleryService('get', '/pages/styles/');

export const getSettingsPage = createGalleryService('get', '/pages/settings/');

export const getApiKeysSettingsPage = createGalleryService(
  'get',
  '/pages/settings/api-keys/'
);

export const getUserAccessTokensSettingsPage = createGalleryService(
  'get',
  '/pages/settings/user-access-tokens/'
);

export const getGalleryPage = createGalleryService(
  'get',
  '/pages/galleries/{gallery_id}/'
);

type a1 = typeof getGalleryPage.parameterSchemasByType;
type a2 = typeof getGalleryPage.parameterSchemasClientByType;

type b1 = typeof getGalleryPage.parameterSchemasByType;
type b2 = typeof getGalleryPage.parameterSchemasClientByType;

type c1 = typeof getApiKeys.parameterSchemasByType;
type c2 = typeof getApiKeys.parameterSchemasClientByType;

type d1 = typeof getIsGalleryAvailable.parameterSchemasByType;
type d2 = typeof getIsGalleryAvailable.parameterSchemasClientByType;

type e1 = typeof getApiKey.parameterSchemasByType;
type e2 = typeof getApiKey.parameterSchemasClientByType;

type f1 = typeof getApiKeyJwt.parameterSchemasByType;
type f2 = typeof getApiKeyJwt.parameterSchemasClientByType;

type g1 = typeof getApiKeysSettingsPage.parameterSchemasByType;
type g2 = typeof getApiKeysSettingsPage.parameterSchemasClientByType;

type as = g1['query']['limit'];
