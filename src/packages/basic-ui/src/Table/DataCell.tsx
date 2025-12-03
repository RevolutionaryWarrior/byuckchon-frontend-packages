/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HeaderType, CheckOptionType } from "./index";
import { Checkbox } from "../index";

type Props = {
  headerCell: HeaderType;
  row: any;
  CellTheme: string;
  checkOptions?: CheckOptionType;
};

const DataCell = ({ headerCell, row, checkOptions, CellTheme }: Props) => {
  const { checkedData, onChange, Icon } = checkOptions || {};

  const handleCheckedChange = () => {
    onChange?.(
      checkedData?.some((item) => item.id === row.id)
        ? checkedData.filter((item) => item.id !== row.id)
        : [...(checkedData || []), row]
    );
  };

  return (
    <td className={CellTheme}>
      {headerCell.key === "check" ? (
        Icon ? (
          Icon
        ) : (
          <Checkbox onChange={handleCheckedChange} checked={checkedData?.some((item) => item.id === row.id)} />
        )
      ) : (
        row[headerCell.key as keyof typeof row]
      )}
    </td>
  );
};

export default DataCell;
