export function allUsersMoneyIfAccountsAreDeleted(userHistory, userMoney) {
  let sortedAccountsFromHistory = [];

  if (userHistory.incomes) {
    const copyOfUserHistory = JSON.parse(JSON.stringify(userHistory));

    const accountsFromHistory = [
      ...new Set(
        copyOfUserHistory.incomes.map((income) =>
          JSON.stringify({
            currency: income.currency,
            _id: income.account,
            name: income.name
          })
        )
      )
    ].map((account) => JSON.parse(account));

    const uniqueAccIds = [
      ...new Set(accountsFromHistory.map((acc) => acc._id))
    ];

    for (let i = 0; i < uniqueAccIds.length; i++) {
      accountsFromHistory.map((acc) => {
        if (acc._id === uniqueAccIds[i]) {
          const sortedAccIds = [
            ...sortedAccountsFromHistory.map((acc) => acc._id)
          ];

          if (!sortedAccIds.includes(acc._id)) {
            sortedAccountsFromHistory.push(acc);
          }
        }
      });
    }

    const uniqueUserMoneyAccIds = [
      ...new Set(userMoney?.map((acc) => acc._id))
    ];

    for (let i = 0; i < userMoney?.length; i++) {
      sortedAccountsFromHistory = sortedAccountsFromHistory.map((acc) => {
        if (uniqueUserMoneyAccIds.includes(acc._id)) {
          for (let j = 0; j < userMoney?.length; j++) {
            if (userMoney[j]._id === acc._id) {
              return { ...acc, name: userMoney[j].name };
            }
          }
        }
        return acc;
      });
    }
  }

  let copyOfUserMoney = [];
  if (userMoney) {
    copyOfUserMoney = JSON.parse(JSON.stringify(userMoney));
  }

  const deletedAndNotAccounts = [
    ...copyOfUserMoney,
    ...sortedAccountsFromHistory
  ].map((account) => {
    delete account.amount;
    return JSON.stringify({
      currency: account.currency,
      _id: account._id,
      name: account.name
    });
  });

  const uniqueDeletedAndNotAccounts = [...new Set(deletedAndNotAccounts)].map(
    (account) => JSON.parse(account)
  );

  return uniqueDeletedAndNotAccounts;
}

export function allUsersExpensesIfExpensesAreDeleted(
  userHistory,
  userExpenses
) {
  let sortedExpensesFromHistory = [];

  if (userHistory.expenses) {
    const copyOfUserHistory = JSON.parse(JSON.stringify(userHistory));

    const expensesFromHistory = [
      ...new Set(
        copyOfUserHistory.expenses.map((expense) =>
          JSON.stringify({
            currency: expense.currency,
            _id: expense.item,
            name: expense.name
          })
        )
      )
    ].map((expense) => JSON.parse(expense));

    const uniqueExpIds = [
      ...new Set(expensesFromHistory.map((exp) => exp._id))
    ];

    for (let i = 0; i < uniqueExpIds.length; i++) {
      expensesFromHistory.map((exp) => {
        if (exp._id === uniqueExpIds[i]) {
          const sortedExpIds = [
            ...sortedExpensesFromHistory.map((exp) => exp._id)
          ];

          if (!sortedExpIds.includes(exp._id)) {
            sortedExpensesFromHistory.push(exp);
          }
        }
      });
    }

    const uniqueRealExpIds = [...new Set(userExpenses?.map((exp) => exp._id))];

    for (let i = 0; i < userExpenses?.length; i++) {
      sortedExpensesFromHistory = sortedExpensesFromHistory.map((exp) => {
        if (uniqueRealExpIds.includes(exp._id)) {
          for (let j = 0; j < userExpenses?.length; j++) {
            if (userExpenses[j]._id === exp._id) {
              return { ...exp, name: userExpenses[j].name };
            }
          }
        }
        return exp;
      });
    }
  }

  let copyOfUserExpenses = [];
  if (userExpenses) {
    copyOfUserExpenses = JSON.parse(JSON.stringify(userExpenses));
  }

  const deletedAndNotItems = [
    ...copyOfUserExpenses,
    ...sortedExpensesFromHistory
  ].map((item) => {
    delete item.amount;
    delete item.icon;
    return JSON.stringify({
      currency: item.currency,
      _id: item._id,
      name: item.name
    });
  });

  const uniqueDeletedAndNotItems = [...new Set(deletedAndNotItems)].map(
    (item) => JSON.parse(item)
  );

  return uniqueDeletedAndNotItems;
}
