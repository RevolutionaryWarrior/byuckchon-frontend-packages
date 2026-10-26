import { useMemo, useState } from "react";
import {
  createCalendarMatrix,
  formatMatrixDates,
} from "./utils/createCalendarMatrix";

type Props = {
  initialDate?: Date;
  includeAdjacentMonths?: boolean;
};

const useMonthCalendar = ({
  initialDate,
  includeAdjacentMonths = false,
}: Props = {}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) {
      return initialDate;
    }

    return new Date();
  });

  // 사용자가 보는 달력은 로컬 시간 기준이다. UTC 로 읽으면 KST 0~9시(자정 포함)가 전날로 계산돼 달이 밀린다.
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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
    newDate.setMonth(month + delta);
    setCurrentDate(newDate);
  };

  const moveToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate: currentDate.toISOString(),
    setCurrentDate,
    monthCalendar,
    moveToNext: () => moveMonth(1),
    moveToPrev: () => moveMonth(-1),
    moveToPeriod: moveMonth,
    moveToToday,
  };
};

export default useMonthCalendar;
