import api from "./api";

const safe = (promise) => {
  return promise.catch((err) => {
    console.error("API ERROR:", err);

    return {
      success: false,
      data: null,
      message: err.message || "Error de servidor",
    };
  });
};

export const safeApi = {
  get: (url, opts) => safe(api.get(url, opts)),
  post: (url, body, opts) => safe(api.post(url, body, opts)),
  put: (url, body, opts) => safe(api.put(url, body, opts)),
  delete: (url, opts) => safe(api.delete(url, opts)),
};