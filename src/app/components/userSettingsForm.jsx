import React, { useState, useEffect, useCallback } from "react";
import TextField from "../components/forms/textField";
import { validate, isValid } from "../utils/userSettnigsValidator";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserPasswordOrEmail,
  getChangeError,
  getSignedUser
} from "../store/user";
import { currencies } from "../constantData/currencies";
import SelectField from "./forms/selectField";

const UserSettingsForm = () => {
  const [data, setData] = useState({
    currency: "",
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    surname: ""
  });
  const [errors, setErrors] = useState({});

  const signedUser = useSelector(getSignedUser());
  const changeError = useSelector(getChangeError());

  const dispatch = useDispatch();

  const selectOptions = currencies;

  useEffect(() => {
    setData({
      currency: selectOptions.filter(
        (cur) => cur.name === signedUser.currency
      )[0]._id,
      email: signedUser.email,
      name: signedUser.name,
      password: "",
      passwordConfirm: "",
      surname: signedUser.surname
    });
  }, []);

  useEffect(() => {
    validate(data, setErrors);
  }, [data]);

  const handleChange = useCallback(({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  }, []);

  const formIsEmpty = Object.values(data).filter(
    (value) => value.length
  ).length;

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 9) {
      e.preventDefault();

      const form = e.target.form;
      const indexField = Array.prototype.indexOf.call(form, e.target);

      form.elements[indexField + 2].focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate(data, setErrors);

    if (!isValid) return;

    dispatch(
      changeUserPasswordOrEmail(
        {
          ...signedUser,
          currency: selectOptions.filter((cur) => cur._id === data.currency)[0]
            .name,
          email: data.email,
          name: data.name,
          surname: data.surname
        },
        data.password
      )
    );
  };

  isValid(errors);

  return (
    <div className="flex flex-col justify-center items-center pt-10">
      <div className="bg-white dark:bg-[#40444b] h-auto w-auto min-w-[300px] m-5 rounded-2xl shadow-xl">
        <form
          action=""
          method="post"
          className="px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Change Name:"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter your Name..."
            error={errors.name}
            autoFocus
          />

          <TextField
            label="Change Surname:"
            name="surname"
            value={data.surname}
            onChange={handleChange}
            placeholder="Enter your Surname..."
            error={errors.surname}
          />

          <div>
            <h1 className="inline-block text-gray-700 dark:text-slate-300 text-sm font-bold mr-5 ">
              Select Default Currency:
            </h1>

            <SelectField
              options={selectOptions}
              name="currency"
              value={data.currency}
              onChange={handleChange}
            />
          </div>

          <TextField
            label="Change Email:"
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter your Email..."
            error={errors.email}
          />

          <TextField
            label="Change Password:"
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password..."
            error={errors.password}
            onKeyDown={handleKeyDown}
          />

          <TextField
            label="Confirm your Password:"
            type="password"
            name="passwordConfirm"
            value={data.passwordConfirm}
            onChange={handleChange}
            placeholder="Enter your password..."
            error={errors.passwordConfirm}
          />

          <div className="flex justify-end mt-8">
            <button
              className={
                "bg-blue-500 dark:bg-[#2e3136] text-white dark:text-slate-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" +
                (!isValid(errors) || !formIsEmpty
                  ? " "
                  : " hover:bg-blue-700 dark:hover:bg-stone-500")
              }
              type="submit"
              disabled={!isValid(errors) || !formIsEmpty}
            >
              Save Changes
            </button>
          </div>
          {changeError && (
            <p className="text-sm text-red-500 overflow-auto">
              {changeError.includes("||")
                ? changeError.split("||")[0].slice(0, -2)
                : changeError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserSettingsForm;
