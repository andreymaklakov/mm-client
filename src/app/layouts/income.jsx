import React from "react";
import IncomePage from "../components/income/incomePage";
import withLogin from "../components/withLogin";

const Income = () => {
  const ComponentWithAuth = withLogin(IncomePage);

  return <ComponentWithAuth />;
};

export default Income;
