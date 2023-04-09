import React from "react";
import PropTypes from "prop-types";

const Loader = ({ size, value }) => {
  return (
    <>
      <div className="grid justify-center">
        <div
          className={
            " border-gray-300 border-t-blue-400 dark:border-t-gray-800 rounded-full animate-spin" +
            (size
              ? " border-[5px] w-[30px] h-[30px] ml-[60px]"
              : " border-[16px] w-[120px] h-[120px] mt-[200px]")
          }
        ></div>
        {size ? "" : <p className="text-4xl dark:text-slate-300 ">Loading</p>}
      </div>
      <p className="text-xl dark:text-slate-300 text-center">{value}</p>
    </>
  );
};

Loader.propTypes = {
  size: PropTypes.string,
  value: PropTypes.string
};

export default Loader;
