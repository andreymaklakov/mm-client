import httpService from "./http.service";
import localStorageService from "./localStorage.service";

const userEndPoint = "users/";

const userService = {
  get: async () => {
    const { data } = await httpService.get(userEndPoint);
    return data;
  },
  create: async (payload) => {
    const { data } = await httpService.put(userEndPoint + payload._id, payload);
    return data;
  },
  getSignedUser: async () => {
    const { data } = await httpService.get(
      userEndPoint + localStorageService.getUserId()
    );
    return data;
  },
  changeUserParams: async (payload) => {
    const { data } = await httpService.patch(
      userEndPoint + payload._id,
      payload
    );
    return data;
  }
};

export default userService;
