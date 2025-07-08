// // src/token.js

// /**
//  * Storage key used for the token.
//  * Change this if you want to use different keys
//  * for different environments.
//  */
// const TOKEN_KEY = "auth_token";

// /**
//  * Stores the token safely.
//  *
//  * @param {string} token - The token string to store.
//  */
// export function setToken(token) {
//   try {
//     if (typeof token !== "string") {
//       throw new Error("Token must be a string");
//     }
//     localStorage.setItem(TOKEN_KEY, token);
//   } catch (err) {
//     console.error("[token.js] Failed to save token:", err);
//   }
// }

// /**
//  * Retrieves the token from storage.
//  *
//  * @returns {string|null} The stored token or null if none.
//  */
// export function getToken() {
//   try {
//     return localStorage.getItem(TOKEN_KEY);
//   } catch (err) {
//     console.error("[token.js] Failed to read token:", err);
//     return null;
//   }
// }

// /**
//  * Clears the token from storage.
//  */
// export function clearToken() {
//   try {
//     localStorage.removeItem(TOKEN_KEY);
//   } catch (err) {
//     console.error("[token.js] Failed to clear token:", err);
//   }
// }

// /**
//  * Checks whether a token currently exists.
//  *
//  * @returns {boolean} True if token exists, false otherwise.
//  */
// export function hasToken() {
//   try {
//     return localStorage.getItem(TOKEN_KEY) !== null;
//   } catch (err) {
//     console.error("[token.js] Failed to check token existence:", err);
//     return false;
//   }
// }
