import httpService from "./http.service";

const historyService = () => {
  const historyEndPoint = `history/`;

  const get = async (userId) => {
    const { data } = await httpService.get(historyEndPoint, {
      params: {
        orderBy: "userId",
        equalTo: userId
      }
    });
    return data;
  };
  const putHistory = async (payload) => {
    const { data } = await httpService.post(historyEndPoint, payload);

    return data;
  };
  const deleteHistory = async (id) => {
    const { data } = await httpService.delete(historyEndPoint + id);
    return data;
  };

  return { get, putHistory, deleteHistory };
};

export default historyService;
