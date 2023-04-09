import React from "react";
import HistoryPage from "../components/history/historyPage";
import withLogin from "../components/withLogin";

const History = () => {
  const ComponentWithAuth = withLogin(HistoryPage);

  return <ComponentWithAuth />;
};

export default History;
