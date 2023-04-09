import React from "react";
import PropTypes from "prop-types";
import { arrowDownIcon, arrowUpIcon } from "../../common/svg";

const HistoryTableHead = ({ columns, sortBy, onSort }) => {
  return (
    <thead>
      <tr>
        {Object.values(columns).map((column) => (
          <th
            key={column.name}
            className="md:text-lg hover:text-stone-400 text-base font-medium cursor-pointer "
            onClick={() => onSort(column.path)}
          >
            {column.name}
            {column.path === sortBy.path ? (
              sortBy.order === "asc" ? (
                arrowDownIcon()
              ) : (
                arrowUpIcon()
              )
            ) : (
              <div className="opacity-0">space</div>
            )}
          </th>
        ))}

        <th />
        <th />
      </tr>
    </thead>
  );
};

HistoryTableHead.propTypes = {
  columns: PropTypes.object,
  sortBy: PropTypes.object,
  onSort: PropTypes.func
};

export default HistoryTableHead;
