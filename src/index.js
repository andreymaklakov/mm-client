import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "./app/utils/history";
import createStore from "./app/store/createStore";

const store = createStore();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router history={history}>
    {/* <React.StrictMode> */}
    <Provider store={store}>
      <App />
    </Provider>
    {/* </React.StrictMode> */}
  </Router>
);

reportWebVitals();
