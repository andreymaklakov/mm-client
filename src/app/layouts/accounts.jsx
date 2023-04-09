import React from "react";
import AccountsPage from "../components/accounts/accountsPage";
import withLogin from "../components/withLogin";

const Accounts = () => {
  const ComponentWithAuth = withLogin(AccountsPage);

  return <ComponentWithAuth />;
};

export default Accounts;
