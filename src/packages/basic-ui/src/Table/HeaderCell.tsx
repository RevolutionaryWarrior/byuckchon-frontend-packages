/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { HeaderType, CheckOptionType } from "./index";
import { Checkbox } from "../index";

const HeaderCell = ({
  cell,
  checkOptions,
  data,
  CellTheme,
}: {
  cell: HeaderType;
  CellTheme: string;
  checkOptions?: CheckOptionType;
  data?: any[];
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { allChecked, onChange } = checkOptions || {};

  const allCheckedChange = () => {
    if (isChecked) {
      setIsChecked(false);
      return onChange?.([]);
    }

    setIsChecked(true);
    return onChange?.(data || []);
  };

  return (
    <th className={CellTheme} style={{ width: cell.width ? cell.width : undefined }} colSpan={cell.colSpan}>
      {allChecked && cell.key === "check" ? (
        checkOptions?.Icon ? (
          checkOptions.Icon
        ) : (
          <Checkbox onChange={allCheckedChange} checked={isChecked} />
        )
      ) : (
        cell.label
      )}
    </th>
  );
};

export default HeaderCell;
