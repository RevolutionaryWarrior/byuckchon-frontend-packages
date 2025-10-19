import { useMemo, useState } from "react";
import {
  createCalendarMatrix,
  formatMatrixDates,
} from "./utils/createCalendarMatrix";

type Props = {
  initialDate?: Date;
  includeAdjacentMonths?: boolean;
};

const MonthCalendar = ({
  initialDate,
  includeAdjacentMonths = false,
}: Props = {}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) {
      return initialDate;
    }

    return new Date();
  });

  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth();

  const calendarMatrix = useMemo(() => {
    return createCalendarMatrix(year, month, includeAdjacentMonths);
  }, [year, month, includeAdjacentMonths]);

  const monthCalendar = useMemo(() => {
    return formatMatrixDates(
      calendarMatrix.matrix,
      year,
      month,
      includeAdjacentMonths,
      calendarMatrix.prevMonthDates,
      calendarMatrix.nextMonthDates
    );
  }, [calendarMatrix, includeAdjacentMonths, year, month]);

  const moveMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setUTCMonth(month + delta);
    setCurrentDate(newDate);
  };

  return {
    currentDate: currentDate.toISOString(),
    setCurrentDate,
    monthCalendar,
    moveToNext: () => moveMonth(1),
    moveToPrev: () => moveMonth(-1),
    moveToPeriod: moveMonth,
  };
};

export default MonthCalendar;
