/* eslint-disable @typescript-eslint/no-explicit-any */
import { twMerge } from "tailwind-merge";
import type { TableTheme } from "./theme";
import { useUITheme } from "../UIThemeProvider/useUITheme";
import HeaderCell from "./HeaderCell";
import DataCell from "./DataCell";

export type HeaderType = {
  key: string;
  label?: string;
  width?: string;
  colSpan?: number;
};

export type CheckOptionType = {
  onChange: (checkData: any[]) => void;
  checkedData?: any[];
  allChecked?: boolean;
  Icon?: React.ReactNode;
};

type Props = {
  header: HeaderType[];
  data: any[];
  checkOptions?: CheckOptionType;
  onRowClick?: (row: any) => void;
};

const baseTheme = {
  tableWrapper: "table-fixed w-full",
  headerWrapper: "sticky top-0 border-y border-[#CCC]",
  headerCell: "border-r border-[#CCC] p-4 text-base",
  dataWrapper: "border-r border-b border-[#CCC]",
  dataCell: "border-r border-[#CCC] p-4 text-base whitespace-normal break-words",
};

const Table = ({ header, data, checkOptions, onRowClick }: Props) => {
  const theme = useUITheme();
  const mergedTheme = Object.entries(baseTheme).reduce((acc, [key, value]) => {
    acc[key as keyof TableTheme] = twMerge(value as string, theme?.table?.[key as keyof TableTheme] as string);
    return acc;
  }, {} as Record<keyof TableTheme, string>);

  return (
    <table className={mergedTheme.tableWrapper}>
      <thead className={mergedTheme.headerWrapper}>
        <tr>
          {header.map((cell) => (
            <HeaderCell
              key={cell.key}
              cell={cell}
              checkOptions={checkOptions}
              data={data}
              CellTheme={mergedTheme.headerCell}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className={mergedTheme.dataWrapper} onClick={() => onRowClick?.(row)}>
            {header.map((cell) => (
              <DataCell
                key={cell.key}
                headerCell={cell}
                row={row}
                checkOptions={checkOptions}
                CellTheme={mergedTheme.dataCell}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
