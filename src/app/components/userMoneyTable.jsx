import React from "react";
import { totalCalc } from "../utils";
import PropTypes from "prop-types";

const UserMoneyTable = ({
  userMoney,
  deleteAccOrIncomeModalOpen,
  accModalOpen,
  deleteOrPlusIcon,
  penOrMinusIcon,
  page,
  selectedPeriod
}) => {
  return (
    <>
      <tr>
        <td className="text-lg pb-2">Total</td>
        <td className="text-lg pb-2 pr-2">
          {userMoney && userMoney.length
            ? totalCalc(userMoney).map((arr) => arr.join("") + " ")
            : 0 + `$`}
        </td>
      </tr>

      {userMoney
        ? userMoney.map((account, i) => (
            <tr key={i}>
              <td>{account.name}</td>
              <td className="mr-6">
                {Number(account.amount).toFixed(2)}
                {account.currency}
              </td>
              <td>
                <button
                  className={
                    (page ? " ml-[-70px]" : " ml-[-40px]") +
                    (i > 0 ? " my-[-10px] " : " mb-[-10px]")
                  }
                  onClick={() => {
                    deleteAccOrIncomeModalOpen(
                      account._id,
                      account.name,
                      true,
                      account.currency
                    );
                  }}
                >
                  {deleteOrPlusIcon()}
                </button>

                <button
                  className={i > 0 ? " my-[-10px] " : " mb-[-10px]"}
                  onClick={
                    accModalOpen
                      ? () => {
                          accModalOpen(true, account.name, account._id);
                        }
                      : () => {
                          deleteAccOrIncomeModalOpen(
                            account._id,
                            account.name,
                            false
                          );
                        }
                  }
                  disabled={
                    (page && account.amount <= 0) ||
                    (page && selectedPeriod !== "This Month")
                  }
                >
                  {penOrMinusIcon(account.amount, selectedPeriod)}
                </button>
              </td>
            </tr>
          ))
        : ""}
    </>
  );
};

UserMoneyTable.propTypes = {
  userMoney: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  deleteAccOrIncomeModalOpen: PropTypes.func,
  accModalOpen: PropTypes.func,
  deleteOrPlusIcon: PropTypes.func,
  penOrMinusIcon: PropTypes.func,
  page: PropTypes.string,
  selectedPeriod: PropTypes.string
};

export default UserMoneyTable;
