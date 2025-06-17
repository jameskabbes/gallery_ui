import createClient from 'openapi-fetch';
import { config } from '../config/config';
import { paths as gallery_paths } from '../gallery_api_schema_client';

export const galleryClient = createClient<gallery_paths>({
  baseUrl: config.backendUrl,
  credentials: 'include',
});

// export const apiClient = axios.create({
//   baseURL: config.backendUrl,
//   timeout: 10000, // 10 seconds timeout, adjust as needed,
//   paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }), // Ensure consistent array serialization
//   withCredentials: true, // Include credentials with requests
// });

// apiClient.interceptors.request.use((config) => {
//   if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
//     config.data = qs.stringify(config.data);
//   }
//   return config;
// });
