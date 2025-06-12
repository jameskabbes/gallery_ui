import createClient from 'openapi-fetch';
import { config } from '../config/config';
import { paths } from '../openapi_schema_client';

export const apiClient = createClient<paths>({
  baseUrl: config.backendUrl,
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
