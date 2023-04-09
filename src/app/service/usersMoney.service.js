import httpService from "./http.service";

const usersMoneyService = () => {
  const usersMoneyEndPoint = "usersMoney/";

  const get = async (userId) => {
    const { data } = await httpService.get(usersMoneyEndPoint, {
      params: {
        orderBy: "userId",
        equalTo: userId
      }
    });

    return data;
  };

  const createAccount = async (payload) => {
    const { data } = await httpService.post(usersMoneyEndPoint, payload);

    return data;
  };

  const deleteAccount = async (id) => {
    const { data } = await httpService.delete(usersMoneyEndPoint + id);
    return data;
  };

  const renameAccount = async (payload, id) => {
    const { data } = await httpService.patch(usersMoneyEndPoint + id, payload);
    return data;
  };

  return { get, createAccount, deleteAccount, renameAccount };
};

export default usersMoneyService;
