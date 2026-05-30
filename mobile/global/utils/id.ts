import * as Crypto from 'expo-crypto';

/**
 * Creates a unique ID using the Web Crypto API. This function generates a UUID (Universally Unique Identifier) which is a 128-bit number used to uniquely identify information in computer systems. The generated ID is in the format of "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" where each "x" is a hexadecimal digit.
 * @returns A unique ID string generated using the Web Crypto API.
 * @example
 * const newId = createId();
 * console.log(newId); // Output: "3f2504e0-4f89-11d3-9a0c-0305e82c3301"
 */
export function createId(): string {
  return Crypto.randomUUID();
}
