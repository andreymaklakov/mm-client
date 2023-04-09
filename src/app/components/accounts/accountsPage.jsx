import React, { useState } from "react";
import { deleteIcon, penIcon } from "../../common/svg";
import AccountModal from "./accountModal";
import UserMoneyTable from "../userMoneyTable";
import AccountRenameModal from "./accountRenameModal";
import Loader from "../loader";
import _ from "lodash";
import { currencies } from "../../constantData/currencies";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, getMoney, getMoneyIsLoading } from "../../store/money";

const AccountsPage = () => {
  const [accountModalIsHidden, setAccountModalIsHidden] = useState(true);
  const [renameModalIsHidden, setRenameModalIsHidden] = useState(true);
  const [account, setAccount] = useState({ _id: "", name: "" });

  const sortBy = { path: "accountTimeStamp", order: "asc" };
  const selectOptions = currencies;

  const userMoney = useSelector(getMoney());
  const isLoading = useSelector(getMoneyIsLoading());

  const dispatch = useDispatch();

  const handleDeleteAccount = (id) => {
    dispatch(deleteAccount(id));
  };

  const handleModalOpen = (isRenameModal, name, id) => {
    isRenameModal
      ? setRenameModalIsHidden(false)
      : setAccountModalIsHidden(false);

    isRenameModal && setAccount({ _id: id, name: name });
  };

  const handleModalClose = () => {
    setAccountModalIsHidden(true);
    setRenameModalIsHidden(true);
  };

  let sortedUserMoney = _.orderBy(userMoney, [sortBy.path], [sortBy.order]);

  if ((selectOptions, !isLoading)) {
    return (
      <div className="flex justify-center">
        <div className="bg-white dark:bg-[#40444b] dark:text-slate-300 w-auto m-5 rounded-2xl shadow-xl min-w-[320px] mt-[60px] ">
          <h1 className="text-center font-medium text-xl mt-4">Accounts</h1>
          <br />

          <table className="table-auto border-spacing-x-10 border-separate">
            <tbody>
              <UserMoneyTable
                userMoney={sortedUserMoney}
                deleteAccOrIncomeModalOpen={handleDeleteAccount}
                accModalOpen={handleModalOpen}
                deleteOrPlusIcon={deleteIcon}
                penOrMinusIcon={penIcon}
              />
            </tbody>
          </table>

          <div>
            <h1
              className="m-10 mt-2 font-medium hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500 rounded 2xl w-[125px] h-[32px] p-1 cursor-pointer"
              onClick={() => {
                handleModalOpen(false);
              }}
            >
              New Account
            </h1>
          </div>
        </div>

        <AccountModal
          modalIsHidden={accountModalIsHidden}
          closeModal={handleModalClose}
          selectOptions={selectOptions}
        />

        <AccountRenameModal
          modalIsHidden={renameModalIsHidden}
          closeModal={handleModalClose}
          item={account}
        />
      </div>
    );
  }
  return <Loader />;
};

export default AccountsPage;
