import axios from "axios";
import localStorageService from "./localStorage.service";
import config from "../config.json";

const httpAuth = axios.create({
  baseURL: config.apiEndPoint + "/auth/",
  // eslint-disable-next-line no-undef
  params: { key: process.env.REACT_APP_FIREBASE_KEY }
});

httpAuth.interceptors.request.use(
  async function (config) {
    const accessToken = localStorageService.getAccessToken();
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      };
    }
    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

const authService = {
  register: async (payload) => {
    const { data } = await httpAuth.post(`signUp`, payload);
    return data;
  },
  login: async ({ email, password }) => {
    const { data } = await httpAuth.post(`signInWithPassword`, {
      email,
      password,
      returnSecureToken: true
    });
    return data;
  },
  refresh: async () => {
    const { data } = await httpAuth.post("token", {
      grant_type: "refresh_token",
      refresh_token: localStorageService.getRefreshToken()
    });

    return data;
  },
  updateEmail: async ({ email, oldEmail }) => {
    const { data } = await httpAuth.put(`changeEmail`, {
      accessToken: localStorageService.getAccessToken(),
      email,
      oldEmail,
      returnSecureToken: true
    });
    return data;
  },
  updatePassword: async ({ email, password }) => {
    const { data } = await httpAuth.put(`changePassword`, {
      accessToken: localStorageService.getAccessToken(),
      email,
      password,
      returnSecureToken: true
    });
    return data;
  }
};

export default authService;
