import { NumericQueryParamSchema } from '../types';
import { boundNumber } from './boundNumber';

type ValidatedNumericSchema<T> = {
  [K in keyof T]: K extends 'default' | 'minimum' | 'maximum' ? number : T[K];
};

export function validateNumericSchema<
  T extends {
    default?: any;
    minimum?: any;
    maximum?: any;
    [key: string]: any;
  }
>(schema: T): ValidatedNumericSchema<T> {
  if (
    'default' in schema &&
    schema.default !== undefined &&
    typeof schema.default !== 'number'
  ) {
    throw new Error('Default value must be a number');
  }

  if (
    'minimum' in schema &&
    schema.minimum !== undefined &&
    typeof schema.minimum !== 'number'
  ) {
    throw new Error('Minimum value must be a number');
  }

  if (
    'maximum' in schema &&
    schema.maximum !== undefined &&
    typeof schema.maximum !== 'number'
  ) {
    throw new Error('Maximum value must be a number');
  }

  return schema as ValidatedNumericSchema<T>;
}

export function getQueryParamKeys<T extends string>(
  obj: Record<T, any>
): Array<T> {
  return Object.keys(obj) as Array<T>;
}

// function parseBoundedNumericQueryParams<TQueryParamKey extends string, V extends Record<TQueryParamKey, any>>(
//   query: URLSearchParams,
//   queryParams: V,
//   schemas: SchemaMapping<TQueryParamKey, V>
// ): Record<TQueryParamKey, number> {
//   const result = {} as Record<TQueryParamKey, number>;

// Record<TQueryParamKey, any>

// function getQueryParamSchemas<
//   TQueryParamKey extends string,
//   V extends Record<TQueryParamKey, { schema: any }>
// >(
//   queryParameterSchemas: V
// ): Record<TQueryParamKey, SchemaMapping<TQueryParamKey, V>> {
//   // Create empty object to populate
//   const schemas = {} as Record<
//     TQueryParamKey,
//     SchemaMapping<TQueryParamKey, V>
//   >;

//   //   loop over the kys of the queryParameterSchemas
//   const queryKeys = Object.keys(queryParameterSchemas) as TQueryParamKey[];

//   // Populate the object for each param
//   for (const name of queryKeys) {
//     const param = queryParameterSchemasByType[name];

//     if (param === undefined) {
//       throw new Error(
//         `Parameter '${name}' does not exist in the query parameters schema for method ${getUserAccessTokensSettingsPage.method} on path ${getUserAccessTokensSettingsPage.url}`
//       );
//     }

//     const schema = (param as any)?.schema;
//     if (schema === undefined) {
//       throw new Error(
//         `Parameter '${name}' does not have a schema in the query parameters schema for method ${getUserAccessTokensSettingsPage.method} on path ${getUserAccessTokensSettingsPage.url}`
//       );
//     }

//     schemas[name] = {
//       maximum: validateSchemaProperty(param, name, 'maximum'),
//       minimum: validateSchemaProperty(param, name, 'minimum'),
//       default: validateSchemaProperty(param, name, 'default'),
//     };
//   }
//   return schemas;
// }

// export function parseBoundedNumericQueryParams<
//   TQueryParamKey extends string,
//   V extends Record<
//     TQueryParamKey,
//     {
//       default?: number;
//       minimum?: number;
//       maximum?: number;
//     }
//   >
// >(
//   query: URLSearchParams,
//   schemas: SchemaMapping<TQueryParamKey, V>
// ): Record<TQueryParamKey, number | null> {
//   const result = {} as Record<TQueryParamKey, number | null>;

//   // Process each schema
//   Object.keys(schemas).forEach((key) => {
//     // Type assertion needed since Object.keys loses the type information
//     const typedKey = key as TQueryParamKey;
//     const schema = schemas[typedKey];

//     // Get the raw value from query parameters
//     // Use the existing parser function with the schema values
//     result[typedKey] = boundNumber(
//       Number(query.get(typedKey)),
//       schema.defaultValue,
//       schema.minimumValue,
//       schema.maximumValue
//     );
//   });
//   return result;
// }

// // Add this function above your existing code
// function validateSchemaProperty(param: any, name: string, property: string) {
//   // Check if property exists
//   if (param.schema[property] === undefined) {
//     throw new Error(
//       `Parameter '${name}' schema is missing '${property}' property for method ${getUserAccessTokensSettingsPage.method} on path ${getUserAccessTokensSettingsPage.url}`
//     );
//   }
//   // Return the property with proper typing
//   return param.schema[property];
// }

// type NumericQueryParamSchemas<TQueryParamKeys extends Array<string>> = {
//   TQueryParamKeys-?: NumericQueryParamSchema;
// };
