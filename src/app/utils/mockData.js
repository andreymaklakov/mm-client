import { useState } from "react";
import httpService from "../components/service/http.service";
import users from "../mockData/users.json";
import history from "../mockData/history.json";
import usersMoney from "../mockData/usersMoney.json";
import incomes from "../mockData/incomes.json";
import expenses from "../mockData/expenses.json";

const useMockData = () => {
  const [error, setError] = useState(null);

  async function initialize() {
    try {
      for (const user of users) {
        await httpService.put("users/" + user._id, user);
      }

      for (const user in expenses) {
        for (const expense of expenses[user]) {
          await httpService.put(`expenses/${user}/${expense._id}/`, expense);
        }
      }

      for (const user in incomes) {
        for (const income of incomes[user]) {
          await httpService.put(`incomes/${user}/${income._id}/`, income);
        }
      }

      for (const user in usersMoney) {
        for (const account of usersMoney[user]) {
          await httpService.put(`usersMoney/${user}/${account._id}/`, account);
        }
      }

      for (const user in history) {
        for (const epxOrInc in history[user]) {
          for (const epxOrIncItem of history[user][epxOrInc]) {
            await httpService.put(
              `history/${user}/${epxOrInc}/${epxOrIncItem._id}/`,
              epxOrIncItem
            );
          }
        }
      }
    } catch (error) {
      setError(error);
    }
  }

  return { error, initialize };
};

export default useMockData;
