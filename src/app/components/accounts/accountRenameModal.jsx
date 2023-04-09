import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { closeIcon } from "../../common/svg";
import TextField from "../forms/textField";
import { validator, isValid } from "../../utils";
import { useDispatch } from "react-redux";
import { renameAccount } from "../../store/money";

const AccountRenameModal = ({ modalIsHidden, closeModal, item }) => {
  const [data, setData] = useState({ _id: "", name: "" });
  const [errors, setErrors] = useState({});

  const modalRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    item &&
      setData((prevState) => ({
        ...prevState,
        _id: item._id,
        name: item.name
      }));
  }, [modalIsHidden]);

  const handleChange = ({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  useEffect(() => {
    validate(data, setErrors);
  }, [data]);

  const validate = useCallback((data, setErrors) => {
    const errors = validator(data);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate(data, setErrors);

    if (!isValid) return;

    dispatch(renameAccount(data));

    closeModal();
  };

  isValid(errors);

  return (
    <div
      ref={modalRef}
      className={
        "flex flex-col justify-center items-center absolute bg-black bg-opacity-50 w-[100vw] h-[110vh]" +
        (modalIsHidden ? " hidden" : "")
      }
      onClick={(event) => {
        event.target === modalRef.current && closeModal();
      }}
    >
      <div className="bg-white dark:bg-[#40444b]  h-auto w-auto absolute top-[100px] min-w-[300px] m-5 rounded-2xl shadow-xl">
        <button
          className="cursor-pointer absolute top-4 right-4 text-stone-800 hover:text-stone-400"
          onClick={() => {
            closeModal();
          }}
        >
          {closeIcon()}
        </button>

        <form
          method="post"
          className="px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Account Name:"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter Account Name..."
            error={errors.name}
            autoFocus
          />

          <div className="flex justify-center mt-8">
            <button
              className={
                " m-10 mt-0 font-medium rounded 2xl w-[125px] p-1 h-[32px]" +
                (isValid(errors)
                  ? " hover:text-stone-400 dark:hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500 dark:text-stone-300"
                  : " text-stone-400 dark:text-stone-500")
              }
              type="submit"
              disabled={!isValid(errors)}
            >
              Change Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AccountRenameModal.propTypes = {
  modalIsHidden: PropTypes.bool,
  closeModal: PropTypes.func,
  item: PropTypes.object
};

export default AccountRenameModal;
