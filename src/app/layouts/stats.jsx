import React from "react";
import StatsPage from "../components/statistics/statsPage";
import withLogin from "../components/withLogin";

const Stats = () => {
  const ComponentWithAuth = withLogin(StatsPage);

  return <ComponentWithAuth />;
};

export default Stats;
