import axios from "axios";

const xaxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROOT,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshTokenQueue = [];
let originalRequestBody;
let originalRequestHeaders;

xaxios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`;
    }
    originalRequestBody = config.data;
    originalRequestHeaders = { ...config.headers };
    return config;
  },
  (error) => Promise.reject(error)
);

xaxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = { ...error.config };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");

        try {
          const response = await axios.post("/refreshToken", {
            token: refreshToken,
          }, {
            baseURL: process.env.NEXT_PUBLIC_API_ROOT,
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.status === 200) {
            const { token, tokenExpire, refreshToken, roles } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("tokenExpire", tokenExpire);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("roles", JSON.stringify(roles));

            const refreshedRequest = { ...originalRequest };

            refreshedRequest.headers = { ...originalRequestHeaders };

            refreshedRequest.headers.Authorization = `Bearer ${token}`;

            if (originalRequestBody instanceof FormData) {
              const formData = new FormData();
              for (const [key, value] of originalRequestBody.entries()) {
                formData.append(key, value);
              }
              refreshedRequest.data = formData;
            } else {
              refreshedRequest.data = originalRequestBody;
            }

            refreshTokenQueue.forEach((resolve) => resolve(token));
            refreshTokenQueue = [];

            return xaxios(refreshedRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          refreshTokenQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(xaxios(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default xaxios;
