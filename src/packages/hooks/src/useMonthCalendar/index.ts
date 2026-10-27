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
    const day = currentDate.getDate();

    // 1일로 먼저 옮긴 뒤 달을 바꿔야 1/31 → 2/31(=3/3) 처럼 넘치지 않는다.
    newDate.setDate(1);
    newDate.setMonth(month + delta);

    // 원래 날짜가 대상 달에 없으면(31일 → 2월 등) 그 달의 마지막 날로 맞춘다.
    const lastDateOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    ).getDate();
    newDate.setDate(Math.min(day, lastDateOfMonth));

    setCurrentDate(newDate);
  };

  const moveToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    // monthCalendar 의 날짜 문자열과 같은 형식(로컬 날짜의 UTC 자정 ISO)으로 맞춘다.
    // toISOString() 을 그대로 쓰면 KST 0~9시가 전날(UTC)로 찍혀 달력 칸과 하루가 어긋난다.
    currentDate: new Date(
      Date.UTC(year, month, currentDate.getDate())
    ).toISOString(),
    setCurrentDate,
    monthCalendar,
    moveToNext: () => moveMonth(1),
    moveToPrev: () => moveMonth(-1),
    moveToPeriod: moveMonth,
    moveToToday,
  };
};

export default useMonthCalendar;
