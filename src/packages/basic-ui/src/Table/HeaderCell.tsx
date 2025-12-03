/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useCallback, useEffect } from "react";
import type { HeaderType, CheckOptionType } from "./index";
import { Checkbox } from "../index";

type Props = {
  cell: HeaderType;
  CellTheme: string;
  checkOptions?: CheckOptionType;
  data: any[];
};

const HeaderCell = ({ cell, checkOptions, data, CellTheme }: Props) => {
  const { allChecked, onChange, checkedData } = checkOptions || {};
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const cellWidth = useMemo(() => {
    return cell.width ? { width: cell.width } : undefined;
  }, [cell.width]);

  const isAllSelected = useCallback(() => {
    if (!allChecked || cell.key !== "check") return false;
    if (data.length !== checkedData?.length) return false;

    const itemIds = new Set(checkedData?.map((item) => item.id));
    return data.every((item) => itemIds.has(item.id));
  }, [allChecked, cell.key, checkedData, data]);

  useEffect(() => {
    setIsChecked(isAllSelected());
  }, [isAllSelected]);

  const onAllChange = () => {
    onChange?.(isChecked ? [] : data);
  };

  return (
    <th className={CellTheme} style={cellWidth} colSpan={cell.colSpan}>
      {allChecked && cell.key === "check" ? (
        checkOptions?.Icon ? (
          checkOptions.Icon
        ) : (
          <Checkbox onChange={onAllChange} checked={isChecked} />
        )
      ) : (
        cell.label
      )}
    </th>
  );
};

export default HeaderCell;
