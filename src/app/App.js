import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar";
import Main from "./layouts/main";
import Login from "./layouts/login";
import SignUp from "./layouts/signup";
import Income from "./layouts/income";
import Accounts from "./layouts/accounts";
import Expenses from "./layouts/expenses";
import User from "./layouts/user";
import History from "./layouts/history";
import Stats from "./layouts/stats";
import ThemeButtons from "./components/themeButtons";
import { ToastContainer } from "react-toastify";
import AppLoader from "./components/hoc/appLoader";

function App() {
  return (
    <>
      <NavBar />

      <AppLoader>
        <main className="bg-stone-200 dark:bg-[#2f3136] w-[100%] h-[90%] md:px-40 fixed overflow-x-hidden overflow-auto pb-[200px]">
          <ThemeButtons />

          <Switch>
            <Route exact path="/main" component={Main} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/income" component={Income} />
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/expenses" component={Expenses} />
            <Route exact path="/settings" component={User} />
            <Route exact path="/history" component={History} />
            <Route exact path="/stats" component={Stats} />

            <Redirect to="/main" />
          </Switch>
        </main>
      </AppLoader>

      <ToastContainer />
    </>
  );
}

export default App;
