export interface GalleryApiSchema {
  openapi: string;
  info: Info;
  paths: Paths;
  components: Components;
}
interface Components {
  schemas: Schemas;
  securitySchemes: SecuritySchemes;
}
interface SecuritySchemes {
  OAuth2PasswordBearerMultiSource: OAuth2PasswordBearerMultiSource;
}
interface OAuth2PasswordBearerMultiSource {
  type: string;
  flows: Flows;
}
interface Flows {
  password: Password;
}
interface Password {
  scopes: Schema2;
  tokenUrl: string;
}
interface Schemas {
  ApiKeyAdminCreate: ApiKeyAdminCreate;
  ApiKeyAdminUpdate: ApiKeyAdminUpdate;
  ApiKeyCreate: ApiKeyCreate;
  ApiKeyJWTResponse: ApiKeyJWTResponse;
  ApiKeyPrivate: ApiKeyPrivate;
  ApiKeyUpdate: ApiKeyAdminUpdate;
  Body_login_password_auth_login_password__post: Bodyloginpasswordauthloginpasswordpost;
  Body_token_auth_token__post: Bodyloginpasswordauthloginpasswordpost;
  Body_upload_file_galleries__gallery_id__upload__post: Bodyuploadfilegalleriesgalleryiduploadpost;
  DetailOnlyResponse: DetailOnlyResponse;
  GalleryAdminCreate: GalleryAdminCreate;
  GalleryAdminUpdate: GalleryAdminUpdate;
  GalleryCreate: GalleryCreate;
  GalleryPageResponse: GalleryPageResponse;
  GalleryPrivate: GalleryPrivate;
  GalleryPublic: GalleryPublic;
  GalleryUpdate: GalleryAdminUpdate;
  GetUserSessionInfoNestedReturn: GetUserSessionInfoNestedReturn;
  GetUserSessionInfoReturn: GetUserSessionInfoReturn;
  HTTPValidationError: HTTPValidationError;
  HomePageResponse: GetUserSessionInfoNestedReturn;
  IsAvailableResponse: IsAvailableResponse;
  LoginWithGoogleRequest: LoginWithGoogleRequest;
  LoginWithGoogleResponse: GetUserSessionInfoNestedReturn;
  LoginWithMagicLinkRequest: LoginWithMagicLinkRequest;
  LoginWithMagicLinkResponse: GetUserSessionInfoNestedReturn;
  LoginWithOTPEmailRequest: LoginWithOTPEmailRequest;
  LoginWithOTPPhoneNumberRequest: LoginWithOTPPhoneNumberRequest;
  LoginWithOTPResponse: GetUserSessionInfoNestedReturn;
  LoginWithPasswordResponse: GetUserSessionInfoNestedReturn;
  ProfilePageResponse: ProfilePageResponse;
  RequestMagicLinkEmailRequest: RequestMagicLinkEmailRequest;
  RequestMagicLinkSMSRequest: RequestMagicLinkSMSRequest;
  RequestOTPEmailRequest: RequestMagicLinkEmailRequest;
  RequestOTPSMSRequest: RequestMagicLinkSMSRequest;
  RequestSignUpEmailRequest: RequestMagicLinkEmailRequest;
  SettingsApiKeysPageResponse: SettingsApiKeysPageResponse;
  SettingsPageResponse: GetUserSessionInfoNestedReturn;
  SettingsUserAccessTokensPageResponse: SettingsUserAccessTokensPageResponse;
  SignUpRequest: LoginWithMagicLinkRequest;
  SignUpResponse: GetUserSessionInfoNestedReturn;
  StylesPageResponse: GetUserSessionInfoNestedReturn;
  TokenResponse: TokenResponse;
  UserAccessToken: UserAccessToken;
  UserAccessTokenAdminCreate: UserAccessTokenAdminCreate;
  UserAccessTokenPublic: UserAccessTokenPublic;
  UserAdminCreate: UserAdminCreate;
  UserAdminUpdate: UserAdminUpdate;
  UserPrivate: UserPrivate;
  UserPublic: UserPublic;
  UserUpdate: UserUpdate;
  ValidationError: ValidationError;
}
interface ValidationError {
  properties: Properties37;
  type: string;
  required: string[];
  title: string;
}
interface Properties37 {
  loc: Loc;
  msg: Schema5;
  type: Schema5;
}
interface Loc {
  items: Items2;
  type: string;
  title: string;
}
interface Items2 {
  anyOf: AnyOf2[];
}
interface UserUpdate {
  properties: Properties36;
  type: string;
  title: string;
}
interface Properties36 {
  phone_number: Clientid;
  username: Name2;
  password: Name;
  email: Email2;
}
interface UserPublic {
  properties: Properties35;
  type: string;
  required: string[];
  title: string;
}
interface Properties35 {
  id: Schema5;
  username: Name2;
}
interface UserPrivate {
  properties: Properties34;
  type: string;
  required: string[];
  title: string;
}
interface Properties34 {
  id: Schema5;
  username: Name2;
  email: Email;
  user_role_id: Schema5;
}
interface UserAdminUpdate {
  properties: Properties33;
  type: string;
  title: string;
}
interface Properties33 {
  phone_number: Clientid;
  username: Name2;
  password: Name;
  email: Email2;
  user_role_id: Clientid;
}
interface Email2 {
  anyOf: AnyOf8[];
  title: string;
}
interface AnyOf8 {
  type: string;
  maxLength?: number;
  minLength?: number;
  format?: string;
}
interface UserAdminCreate {
  properties: Properties32;
  type: string;
  required: string[];
  title: string;
}
interface Properties32 {
  phone_number: Clientid;
  username: Name2;
  password: Name;
  email: Email;
  user_role_id: Userroleid;
}
interface Userroleid {
  type: string;
  title: string;
  default: number;
}
interface UserAccessTokenPublic {
  properties: Properties31;
  type: string;
  required: string[];
  title: string;
}
interface Properties31 {
  id: Schema5;
  expiry: Expiry;
}
interface UserAccessTokenAdminCreate {
  properties: Properties30;
  type: string;
  required: string[];
  title: string;
}
interface Properties30 {
  expiry: Expiry;
  user_id: Schema5;
}
interface UserAccessToken {
  properties: Properties29;
  type: string;
  required: string[];
  title: string;
}
interface Properties29 {
  issued: Expiry;
  expiry: Expiry;
  user_id: Schema5;
  id: Schema5;
}
interface TokenResponse {
  properties: Properties28;
  type: string;
  required: string[];
  title: string;
}
interface Properties28 {
  access_token: Schema5;
  token_type: Schema5;
}
interface SettingsUserAccessTokensPageResponse {
  properties: Properties27;
  type: string;
  required: string[];
  title: string;
}
interface Properties27 {
  auth: Schema;
  user_access_token_count: Schema5;
  user_access_tokens: Schema4;
}
interface SettingsApiKeysPageResponse {
  properties: Properties26;
  type: string;
  required: string[];
  title: string;
}
interface Properties26 {
  auth: Schema;
  api_key_count: Schema5;
  api_keys: Schema4;
}
interface RequestMagicLinkSMSRequest {
  properties: Properties25;
  type: string;
  required: string[];
  title: string;
}
interface Properties25 {
  phone_number: Schema5;
}
interface RequestMagicLinkEmailRequest {
  properties: Properties24;
  type: string;
  required: string[];
  title: string;
}
interface Properties24 {
  email: Email;
}
interface ProfilePageResponse {
  properties: Properties23;
  type: string;
  required: string[];
  title: string;
}
interface Properties23 {
  auth: Schema;
  user: User;
}
interface LoginWithOTPPhoneNumberRequest {
  properties: Properties22;
  type: string;
  required: string[];
  title: string;
}
interface Properties22 {
  code: Schema6;
  phone_number: Schema5;
}
interface LoginWithOTPEmailRequest {
  properties: Properties21;
  type: string;
  required: string[];
  title: string;
}
interface Properties21 {
  code: Schema6;
  email: Email;
}
interface Email {
  type: string;
  maxLength: number;
  minLength: number;
  format: string;
  title: string;
}
interface LoginWithMagicLinkRequest {
  properties: Properties20;
  type: string;
  required: string[];
  title: string;
}
interface Properties20 {
  token: Schema5;
}
interface LoginWithGoogleRequest {
  properties: Properties19;
  type: string;
  required: string[];
  title: string;
}
interface Properties19 {
  id_token: Schema5;
}
interface IsAvailableResponse {
  properties: Properties18;
  type: string;
  required: string[];
  title: string;
}
interface Properties18 {
  available: Schema5;
}
interface HTTPValidationError {
  properties: Properties17;
  type: string;
  title: string;
}
interface Properties17 {
  detail: Schema4;
}
interface GetUserSessionInfoReturn {
  properties: Properties16;
  type: string;
  required: string[];
  title: string;
}
interface Properties16 {
  user: User;
  scope_ids: Scopeids;
  access_token: User;
}
interface Scopeids {
  anyOf: AnyOf7[];
  title: string;
}
interface AnyOf7 {
  items?: AnyOf2;
  type: string;
  uniqueItems?: boolean;
}
interface User {
  anyOf: AnyOf6[];
}
interface AnyOf6 {
  '$ref'?: string;
  type?: string;
}
interface GetUserSessionInfoNestedReturn {
  properties: Properties15;
  type: string;
  required: string[];
  title: string;
}
interface Properties15 {
  auth: Schema;
}
interface GalleryPublic {
  properties: Properties14;
  type: string;
  required: string[];
  title: string;
}
interface Properties14 {
  id: Schema5;
  user_id: Schema5;
  name: Schema6;
  parent_id: Clientid;
  description: Name;
  date: Expiry2;
}
interface GalleryPrivate {
  properties: Properties13;
  type: string;
  required: string[];
  title: string;
}
interface Properties13 {
  id: Schema5;
  user_id: Schema5;
  name: Schema6;
  parent_id: Clientid;
  description: Name;
  date: Expiry2;
  visibility_level: Schema5;
}
interface GalleryPageResponse {
  properties: Properties12;
  type: string;
  required: string[];
  title: string;
}
interface Properties12 {
  auth: Schema;
  gallery: Schema;
  parents: Schema4;
  children: Schema4;
}
interface GalleryCreate {
  properties: Properties11;
  type: string;
  required: string[];
  title: string;
}
interface Properties11 {
  name: Schema6;
  visibility_level: Schema5;
  description: Name;
  date: Expiry2;
  parent_id: Schema5;
}
interface GalleryAdminUpdate {
  properties: Properties10;
  type: string;
  title: string;
}
interface Properties10 {
  name: Name2;
  user_id: Clientid;
  visibility_level: Clientid;
  parent_id: Clientid;
  description: Name;
  date: Expiry2;
}
interface Name2 {
  anyOf: AnyOf5[];
  title: string;
}
interface AnyOf5 {
  type: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}
interface GalleryAdminCreate {
  properties: Properties9;
  type: string;
  required: string[];
  title: string;
}
interface Properties9 {
  name: Schema6;
  visibility_level: Schema5;
  description: Name;
  date: Expiry2;
  user_id: Schema5;
  parent_id: Clientid;
}
interface DetailOnlyResponse {
  properties: Properties8;
  type: string;
  required: string[];
  title: string;
}
interface Properties8 {
  detail: Schema5;
}
interface Bodyuploadfilegalleriesgalleryiduploadpost {
  properties: Properties7;
  type: string;
  required: string[];
  title: string;
}
interface Properties7 {
  file: Expiry;
}
interface Bodyloginpasswordauthloginpasswordpost {
  properties: Properties6;
  type: string;
  required: string[];
  title: string;
}
interface Properties6 {
  stay_signed_in: Staysignedin;
  grant_type: Granttype;
  username: Schema5;
  password: Schema5;
  scope: Scope;
  client_id: Clientid;
  client_secret: Clientid;
}
interface Clientid {
  anyOf: AnyOf2[];
  title: string;
}
interface Scope {
  type: string;
  title: string;
  default: string;
}
interface Granttype {
  anyOf: AnyOf4[];
  title: string;
}
interface AnyOf4 {
  type: string;
  pattern?: string;
}
interface Staysignedin {
  type: string;
  default: boolean;
  title: string;
}
interface ApiKeyPrivate {
  properties: Properties5;
  type: string;
  required: string[];
  title: string;
}
interface Properties5 {
  id: Schema5;
  user_id: Schema5;
  name: Schema9;
  issued: Expiry;
  expiry: Expiry;
}
interface ApiKeyJWTResponse {
  properties: Properties4;
  type: string;
  required: string[];
  title: string;
}
interface Properties4 {
  jwt: Schema5;
}
interface ApiKeyCreate {
  properties: Properties3;
  type: string;
  required: string[];
  title: string;
}
interface Properties3 {
  name: Schema9;
  expiry: Expiry;
}
interface ApiKeyAdminUpdate {
  properties: Properties2;
  type: string;
  title: string;
}
interface Properties2 {
  name: Name;
  expiry: Expiry2;
}
interface Expiry2 {
  anyOf: AnyOf[];
  title: string;
}
interface Name {
  anyOf: AnyOf3[];
  title: string;
}
interface AnyOf3 {
  type: string;
  maxLength?: number;
  minLength?: number;
}
interface ApiKeyAdminCreate {
  properties: Properties;
  type: string;
  required: string[];
  title: string;
}
interface Properties {
  name: Schema9;
  expiry: Expiry;
  user_id: Schema5;
}
interface Expiry {
  type: string;
  format: string;
  title: string;
}
interface Paths {
  '/auth/': Auth;
  '/auth/token/': Authtoken;
  '/auth/login/password/': Authloginpassword;
  '/auth/login/magic-link/': Authloginmagiclink;
  '/auth/login/otp/email/': Authloginotpemail;
  '/auth/login/otp/phone_number/': Authloginotpemail;
  '/auth/signup/': Authloginotpemail;
  '/auth/login/google/': Authlogingoogle;
  '/auth/request/signup/': Authrequestsignup;
  '/auth/request/magic-link/email/': Authrequestsignup;
  '/auth/request/magic-link/sms/': Authrequestsignup;
  '/auth/request/otp/email/': Authrequestsignup;
  '/auth/request/otp/sms/': Authrequestsignup;
  '/auth/logout/': Authlogout;
  '/users/': Users;
  '/users/me/': Usersme;
  '/users/{user_id}/': Usersuserid;
  '/users/available/username/{username}/': Usersavailableusernameusername;
  '/galleries/': Galleries;
  '/galleries/{gallery_id}/': Galleriesgalleryid;
  '/galleries/details/available/': Galleriesdetailsavailable;
  '/galleries/{gallery_id}/upload/': Galleriesgalleryidupload;
  '/galleries/{gallery_id}/sync/': Galleriesgalleryidsync;
  '/user-access-tokens/': Users;
  '/user-access-tokens/{user_access_token_id}/': Useraccesstokensuseraccesstokenid;
  '/user-access-tokens/details/count/': Useraccesstokensdetailscount;
  '/api-keys/': Apikeys;
  '/api-keys/{api_key_id}/': Galleriesgalleryid;
  '/api-keys/{api_key_id}/generate-jwt/': Usersuserid;
  '/api-keys/details/available/': Apikeysdetailsavailable;
  '/api-keys/details/count/': Useraccesstokensdetailscount;
  '/api-key-scopes/api-keys/{api_key_id}/scopes/{scope_id}/': Apikeyscopesapikeysapikeyidscopesscopeid;
  '/pages/profile/': Auth;
  '/pages/home/': Auth;
  '/pages/settings/': Auth;
  '/pages/settings/api-keys/': Pagessettingsapikeys;
  '/pages/settings/user-access-tokens/': Pagessettingsuseraccesstokens;
  '/pages/styles/': Auth;
  '/pages/galleries/{gallery_id}/': Pagesgalleriesgalleryid;
  '/admin/users/': Galleries;
  '/admin/users/{user_id}/': Galleriesgalleryid;
  '/admin/galleries/{gallery_id}/': Galleriesgalleryid;
  '/admin/galleries/': Admingalleries;
  '/admin/galleries/details/available/': Galleriesdetailsavailable;
  '/admin/galleries/users/{user_id}': Admingalleriesusersuserid;
  '/admin/user-access-tokens/users/{user_id}/': Admingalleriesusersuserid;
  '/admin/user-access-tokens/{user_access_token_id}/': Useraccesstokensuseraccesstokenid;
  '/admin/user-access-tokens/': Admingalleries;
  '/admin/api-keys/users/{user_id}/': Adminapikeysusersuserid;
  '/admin/api-keys/{api_key_id}/': Galleriesgalleryid;
  '/admin/api-keys/': Admingalleries;
  '/admin/api-keys/details/available/': Adminapikeysdetailsavailable;
  '/admin/api-key-scopes/api-keys/{api_key_id}/scopes/{scope_id}/': Apikeyscopesapikeysapikeyidscopesscopeid;
}
interface Adminapikeysdetailsavailable {
  get: Get14;
}
interface Get14 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter10[];
  responses: Responses5;
}
interface Parameter10 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema13;
}
interface Schema13 {
  type: string;
  minLength?: number;
  maxLength?: number;
  title: string;
}
interface Adminapikeysusersuserid {
  get: Get13;
}
interface Get13 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter9[];
  responses: Responses6;
}
interface Parameter9 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema12;
  description?: string;
}
interface Schema12 {
  type: string;
  title: string;
  maximum?: number;
  minimum?: number;
  description?: string;
  default?: any[] | number;
  items?: Items;
}
interface Admingalleriesusersuserid {
  get: Get12;
}
interface Get12 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter8[];
  responses: Responses6;
}
interface Parameter8 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema11;
  description?: string;
}
interface Schema11 {
  type: string;
  title: string;
  maximum?: number;
  minimum?: number;
  description?: string;
  default?: number;
}
interface Admingalleries {
  post: Patch;
}
interface Pagesgalleriesgalleryid {
  get: Get11;
}
interface Get11 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter7[];
  responses: Responses2;
}
interface Parameter7 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema10;
}
interface Schema10 {
  anyOf?: AnyOf2[];
  title: string;
  type?: string;
  default?: boolean;
}
interface AnyOf2 {
  type: string;
}
interface Pagessettingsuseraccesstokens {
  get: Get10;
}
interface Get10 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter[];
  responses: Responses2;
}
interface Pagessettingsapikeys {
  get: Get9;
}
interface Get9 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter5[];
  responses: Responses2;
}
interface Apikeyscopesapikeysapikeyidscopesscopeid {
  post: Post8;
  delete: Delete2;
}
interface Post8 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses5;
}
interface Apikeysdetailsavailable {
  get: Get8;
}
interface Get8 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter6[];
  responses: Responses2;
}
interface Parameter6 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema9;
}
interface Schema9 {
  type: string;
  minLength: number;
  maxLength: number;
  title: string;
}
interface Apikeys {
  get: Get7;
  post: Patch;
}
interface Get7 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter5[];
  responses: Responses6;
}
interface Parameter5 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema8;
  description: string;
}
interface Schema8 {
  type: string;
  maximum?: number;
  minimum?: number;
  description: string;
  default: any[] | number;
  title: string;
  items?: Items;
}
interface Items {
  enum: string[];
  type: string;
}
interface Useraccesstokensdetailscount {
  get: Get6;
}
interface Get6 {
  tags: string[];
  summary: string;
  operationId: string;
  responses: Responses10;
  security: Security[];
}
interface Responses10 {
  '200': _2004;
}
interface _2004 {
  description: string;
  content: Content6;
}
interface Content6 {
  'application/json': Applicationjson4;
}
interface Applicationjson4 {
  schema: Schema5;
}
interface Useraccesstokensuseraccesstokenid {
  get: Get3;
  delete: Delete2;
}
interface Galleriesgalleryidsync {
  post: Get3;
}
interface Galleriesgalleryidupload {
  post: Post7;
}
interface Post7 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  requestBody: RequestBody3;
  responses: Responses9;
}
interface Responses9 {
  '201': _2002;
  '422': _200;
}
interface RequestBody3 {
  required: boolean;
  content: Content5;
}
interface Content5 {
  'multipart/form-data': Applicationjson;
}
interface Galleriesdetailsavailable {
  get: Get5;
}
interface Get5 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter4[];
  responses: Responses5;
}
interface Parameter4 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema7;
}
interface Schema7 {
  type?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  title: string;
  anyOf?: AnyOf[];
}
interface AnyOf {
  type: string;
  format?: string;
}
interface Galleriesgalleryid {
  get: Get3;
  patch: Patch2;
  delete: Delete2;
}
interface Delete2 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses8;
}
interface Responses8 {
  '204': _204;
  '422': _200;
}
interface Patch2 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  requestBody: RequestBody2;
  responses: Responses2;
}
interface Galleries {
  get: Get2;
  post: Patch;
}
interface Usersavailableusernameusername {
  get: Get4;
}
interface Get4 {
  tags: string[];
  summary: string;
  operationId: string;
  parameters: Parameter3[];
  responses: Responses2;
}
interface Parameter3 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema6;
}
interface Schema6 {
  type: string;
  minLength: number;
  maxLength: number;
  pattern: string;
  title: string;
}
interface Usersuserid {
  get: Get3;
}
interface Get3 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses2;
}
interface Parameter2 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema5;
}
interface Schema5 {
  type: string;
  title: string;
}
interface Usersme {
  get: Get;
  delete: Delete;
  patch: Patch;
}
interface Patch {
  tags: string[];
  summary: string;
  operationId: string;
  requestBody: RequestBody2;
  responses: Responses2;
  security: Security[];
}
interface Delete {
  tags: string[];
  summary: string;
  operationId: string;
  responses: Responses7;
  security: Security[];
}
interface Responses7 {
  '204': _204;
}
interface _204 {
  description: string;
}
interface Users {
  get: Get2;
}
interface Get2 {
  tags: string[];
  summary: string;
  operationId: string;
  security: Security[];
  parameters: Parameter[];
  responses: Responses6;
}
interface Responses6 {
  '200': _2003;
  '422': _200;
}
interface _2003 {
  description: string;
  content: Content4;
}
interface Content4 {
  'application/json': Applicationjson3;
}
interface Applicationjson3 {
  schema: Schema4;
}
interface Schema4 {
  type: string;
  items: Schema;
  title: string;
}
interface Parameter {
  name: string;
  in: string;
  required: boolean;
  schema: Schema3;
  description: string;
}
interface Schema3 {
  type: string;
  maximum?: number;
  minimum: number;
  description: string;
  default: number;
  title: string;
}
interface Authlogout {
  post: Get;
}
interface Authrequestsignup {
  post: Post6;
}
interface Post6 {
  tags: string[];
  summary: string;
  operationId: string;
  requestBody: RequestBody2;
  responses: Responses5;
}
interface Responses5 {
  '200': _2002;
  '422': _200;
}
interface _2002 {
  description: string;
  content: Content3;
}
interface Content3 {
  'application/json': Applicationjson2;
}
interface Applicationjson2 {
  schema: Schema2;
}
interface Schema2 {
}
interface Authlogingoogle {
  post: Post5;
}
interface Post5 {
  tags: string[];
  summary: string;
  operationId: string;
  requestBody: RequestBody2;
  responses: Responses4;
}
interface Responses4 {
  '200': _200;
  '400': _200;
  '422': _200;
}
interface Authloginotpemail {
  post: Post4;
}
interface Post4 {
  tags: string[];
  summary: string;
  operationId: string;
  requestBody: RequestBody2;
  responses: Responses2;
}
interface Authloginmagiclink {
  post: Post3;
}
interface Post3 {
  tags: string[];
  summary: string;
  operationId: string;
  requestBody: RequestBody2;
  responses: Responses3;
}
interface RequestBody2 {
  content: Content;
  required: boolean;
}
interface Authloginpassword {
  post: Post2;
}
interface Post2 {
  tags: string[];
  summary: string;
  operationId: string;
  requestBody: RequestBody;
  responses: Responses3;
}
interface Responses3 {
  '200': _200;
  '401': _200;
  '422': _200;
}
interface Authtoken {
  post: Post;
}
interface Post {
  tags: string[];
  summary: string;
  operationId: string;
  requestBody: RequestBody;
  responses: Responses2;
}
interface Responses2 {
  '200': _200;
  '422': _200;
}
interface RequestBody {
  content: Content2;
  required: boolean;
}
interface Content2 {
  'application/x-www-form-urlencoded': Applicationjson;
}
interface Auth {
  get: Get;
}
interface Get {
  tags: string[];
  summary: string;
  operationId: string;
  responses: Responses;
  security: Security[];
}
interface Security {
  OAuth2PasswordBearerMultiSource: any[];
}
interface Responses {
  '200': _200;
}
interface _200 {
  description: string;
  content: Content;
}
interface Content {
  'application/json': Applicationjson;
}
interface Applicationjson {
  schema: Schema;
}
interface Schema {
  '$ref': string;
}
interface Info {
  title: string;
  version: string;
}