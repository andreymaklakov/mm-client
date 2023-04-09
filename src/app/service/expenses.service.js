import httpService from "./http.service";

const expensesService = () => {
  const expensesEndPoint = `expenses/`;

  const get = async (userId) => {
    const { data } = await httpService.get(expensesEndPoint, {
      params: {
        orderBy: "userId",
        equalTo: userId
      }
    });

    return data;
  };
  const createExpense = async (payload) => {
    const { data } = await httpService.post(expensesEndPoint, payload);

    return data;
  };
  const changeExpenseParams = async (payload, id) => {
    const { data } = await httpService.patch(expensesEndPoint + id, payload);
    return data;
  };
  const deleteExpense = async (id) => {
    const { data } = await httpService.delete(expensesEndPoint + id);
    return data;
  };

  return { get, createExpense, changeExpenseParams, deleteExpense };
};

export default expensesService;
