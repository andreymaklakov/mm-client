import React, { useState } from "react";
import PropTypes from "prop-types";
import { eyeIcon, eyeOffIcon } from "../../common/svg";

const TextField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassWord] = useState(false);

  const toggleShowPassword = () => {
    setShowPassWord((prevState) => !prevState);
  };

  return (
    <div className="mb-5 w-full relative">
      <label
        className="block text-gray-700 dark:text-slate-300 mt-5 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>

      <input
        className={
          "dark:bg-[#595e67] shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-slate-200 leading-tight focus:outline-none focus:shadow-outline" +
          (error ? " border-red-500" : "")
        }
        type={showPassword ? "text" : type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? 0 : ""}
        step={type === "number" ? ".01" : null}
        pattern={type === "number" ? "^d*(.d{0,2})?$" : null}
        {...rest}
      />

      {type === "password" && (
        <button
          type="button"
          onMouseDown={toggleShowPassword}
          onMouseUp={toggleShowPassword}
        >
          {showPassword ? eyeOffIcon() : eyeIcon()}
        </button>
      )}

      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
};

TextField.defaultProps = {
  type: "text"
};

TextField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string
};

export default React.memo(TextField);
