// // src/apiFetch.js

// console.log("[apiFetch] window._env_ =", window._env_);

// const BASE_URL = window._env_?.API_URL;

// console.log("[apiFetch] BASE_URL =", BASE_URL);

// if (!BASE_URL) {
//   throw new Error(
//     "🚨 BASE_URL is undefined! Check that env.js is loaded BEFORE your app scripts."
//   );
// }

// export default async function apiFetch(endpoint, options = {}) {
//   const url = BASE_URL + endpoint;
//   const token = getToken();

//   console.log("[apiFetch] url =", url);
//   console.log("[apiFetch] method =", options.method || "GET");
//   console.log("[apiFetch] token =", token);

//   const config = {
//     method: options.method || "GET",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(options.headers || {}),
//     },
//     credentials: "include",
//   };

//   if (options.body) {
//     config.body = JSON.stringify(options.body);
//     console.log("[apiFetch] request body =", config.body);
//   }

//   console.log("[apiFetch] request config =", config);

//   try {
//     const res = await fetch(url, config);

//     const isJson = res.headers
//       .get("content-type")
//       ?.includes("application/json");

//     console.log("[apiFetch] response status =", res.status);
//     console.log("[apiFetch] response headers =", [...res.headers.entries()]);

//     const data = isJson ? await res.json() : null;

//     console.log("[apiFetch] response data =", data);

//     if (!res.ok) {
//       throw {
//         status: res.status,
//         message: data?.message || data?.error || "Something went wrong.",
//         errors: data?.errors || [],
//       };
//     }

//     return data;
//   } catch (e) {
//     console.error("[apiFetch] error caught:", e);
//     if (e.status) throw e;
//     throw {
//       status: 500,
//       message: "Unable to connect to server. Please try again.",
//       errors: [],
//     };
//   }
// }

// /**
//  * Example getToken function
//  */
// function getToken() {
//   return localStorage.getItem("token") || null;
// }
