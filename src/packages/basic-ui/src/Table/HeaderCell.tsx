/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import type { HeaderType, CheckOptionType } from "./index";
import { Checkbox } from "../index";

type Props = {
  cell: HeaderType;
  CellTheme: string;
  checkOptions?: CheckOptionType;
  data: any[];
};

const HeaderCell = ({ cell, checkOptions, data, CellTheme }: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { allChecked, onChange } = checkOptions || {};
  const cellWidth = useMemo(() => {
    return cell.width ? { width: cell.width } : undefined;
  }, [cell.width]);

  const allCheckedChange = () => {
    if (isChecked) {
      setIsChecked(false);
      return onChange?.([]);
    }

    setIsChecked(true);
    return onChange?.(data || []);
  };

  return (
    <th className={CellTheme} style={cellWidth} colSpan={cell.colSpan}>
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
