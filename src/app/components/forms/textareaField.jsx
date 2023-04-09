import React from "react";
import PropTypes from "prop-types";

const TextareaField = ({ name, value, onChange, placeholder }) => {
  return (
    <>
      <label
        className="block text-gray-700 dark:text-slate-300 text-sm font-bold mt-5 mb-2"
        htmlFor="comment"
      >
        Comment:
      </label>

      <textarea
        className="dark:bg-[#595e67] shadow appearance-none border rounded-lg w-full size-30 py-2 px-3 text-gray-700 dark:text-slate-300 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder={placeholder}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      ></textarea>
    </>
  );
};

TextareaField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

export default React.memo(TextareaField);
