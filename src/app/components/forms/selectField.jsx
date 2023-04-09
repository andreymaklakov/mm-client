import React from "react";
import PropTypes from "prop-types";

const SelectField = ({
  options,
  name,
  value,
  onChange,
  disabledCheck,
  error,
  defaultOption
}) => {
  return (
    <>
      <select
        id={name}
        value={value}
        onChange={onChange}
        name={name}
        className={
          "dark:text-slate-300 inline-block appearance-none bg-white dark:bg-[#595e67] border-gray-400 hover:border-gray-500 px-4 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer border py-2" +
          (error ? " border-red-500" : "")
        }
      >
        <option disabled value="">
          {defaultOption}
        </option>

        {options &&
          options.map((option) => (
            <option
              key={option.name + option._id}
              disabled={disabledCheck && option.currency !== disabledCheck}
              value={option._id}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={option.tooltipTitle || ""}
            >
              {option.name}
            </option>
          ))}
      </select>

      {error && <div className="text-sm text-red-500">{error}</div>}
    </>
  );
};

SelectField.propTypes = {
  options: PropTypes.array,
  tooltipTitle: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  name: PropTypes.string,
  disabledCheck: PropTypes.string,
  check: PropTypes.bool,
  error: PropTypes.string,
  defaultOption: PropTypes.string
};

export default React.memo(SelectField);
