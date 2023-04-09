import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { closeIcon } from "../../common/svg";

const ExpenseIconsModal = ({
  modalIsHidden,
  closeModal,
  onClick,
  data,
  icons,
  iconsLink
}) => {
  const [choosenIcon, setChoosenIcon] = useState("");

  const modalRef = useRef();

  useEffect(() => {
    setChoosenIcon(data);
  }, [modalIsHidden]);

  const handleClick = (icon) => {
    setChoosenIcon(icon);
  };

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
      <div className="bg-white dark:bg-[#40444b] dark:text-slate-300  h-auto w-auto absolute top-[100px] min-w-[300px] m-5 rounded-2xl shadow-xl">
        <h1 className="text-center font-medium	text-xl mt-4">Choose Icon</h1>

        <div
          className="cursor-pointer absolute top-4 right-4 text-stone-800 hover:text-stone-400"
          onClick={closeModal}
        >
          {closeIcon()}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 justify-items-center m-5 h-[220px] overflow-auto">
          {icons &&
            Object.values(icons).map((icon) => {
              if (icon !== icons.add) {
                return (
                  <button
                    key={icon}
                    className={
                      "flex flex-col items-center cursor-pointer  hover:-translate-y-1 hover:scale-110 transition duration-300 ease-in-out h-[42px] w-[42px]" +
                      (choosenIcon === icon
                        ? " border-[1px] rounded-lg border-black dark:border-stone-500 p-1"
                        : "")
                    }
                    onClick={() => handleClick(icon)}
                  >
                    <img src={`${iconsLink}${icon}.png`} alt="icon" />
                  </button>
                );
              }
            })}
        </div>

        <div className="mt-2 text-center">
          <button
            className="mt-0 mb-5 font-medium hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500 rounded 2xl w-[125px] h-[32px] p-1"
            onClick={async () => {
              await onClick(choosenIcon);
            }}
          >
            Choose Icon
          </button>
        </div>
      </div>
    </div>
  );
};

ExpenseIconsModal.propTypes = {
  modalIsHidden: PropTypes.bool,
  closeModal: PropTypes.func,
  onClick: PropTypes.func,
  data: PropTypes.string,
  icons: PropTypes.object,
  iconsLink: PropTypes.string
};

export default ExpenseIconsModal;
