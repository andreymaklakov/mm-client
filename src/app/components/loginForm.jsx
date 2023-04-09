import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import TextField from "./forms/textField";
import { validator, isValid } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { getLogInError, getSignedUser, logIn } from "../store/user";

const LoginForm = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const history = useHistory();
  const dispatch = useDispatch();

  const signedUser = useSelector(getSignedUser());
  const authError = useSelector(getLogInError());

  const handleChange = useCallback(({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  }, []);

  const validatorConfig = {
    email: {
      isRequired: { message: "Email is required" }
    },
    password: {
      isRequired: { message: "Password is required" }
    }
  };

  useEffect(() => {
    validate(data, setErrors);
  }, [data]);

  useEffect(() => {
    signedUser && handleLogIn(signedUser._id);
  }, [signedUser]);

  const validate = useCallback((data, setErrors) => {
    const errors = validator(data, validatorConfig);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }, []);

  const handleLogIn = () => {
    history.replace(`/main`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate(data, setErrors);

    if (!isValid) return;

    dispatch(logIn(data));
  };

  isValid(errors);

  return (
    <div className="flex flex-col justify-center items-center pt-10">
      <h1 className="dark:text-slate-300  text-center font-medium	text-xl">
        Log In
      </h1>
      <div className="bg-white dark:bg-[#40444b] h-auto w-auto min-w-[300px] m-5 rounded-2xl shadow-xl">
        <form
          method="post"
          className="px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email:"
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter your Email..."
            error={errors.email}
            autoFocus
          />

          <TextField
            label="Password:"
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password..."
            error={errors.password}
          />

          <div className="flex items-center justify-between mt-8">
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 dark:text-slate-200 hover:text-blue-800 dark:hover:text-stone-500"
              to="/signup"
            >
              Sign Up
            </Link>

            <button
              className={
                "bg-blue-500 dark:bg-[#2e3136]   text-white dark:text-slate-200  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" +
                (!isValid(errors)
                  ? " bg-blue-400 dark:bg-[#383b41]"
                  : " hover:bg-blue-700 dark:hover:bg-stone-500")
              }
              type="submit"
              disabled={!isValid(errors)}
            >
              Log In
            </button>
          </div>

          {authError && (
            <p className="text-sm text-red-500 overflow-auto">{authError}</p>
          )}
        </form>
      </div>
      <p className="text-center text-gray-500 text-xs">
        &copy;2022 Money Manager. All rights reserved.
      </p>
    </div>
  );
};

export default LoginForm;
