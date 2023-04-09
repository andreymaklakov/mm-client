import React from "react";
import ExpensesPage from "../components/expenses/expensesPage";
import withLogin from "../components/withLogin";

const Expenses = () => {
  const ComponentWithAuth = withLogin(ExpensesPage);

  return <ComponentWithAuth />;
};

export default Expenses;
