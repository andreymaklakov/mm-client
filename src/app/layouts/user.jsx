import React from "react";
import UserSettingsForm from "../components/userSettingsForm";
import withLogin from "../components/withLogin";

const User = () => {
  const ComponentWithAuth = withLogin(UserSettingsForm);

  return <ComponentWithAuth />;
};

export default User;
