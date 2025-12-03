import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import Calendar, { type CalendarProps } from "react-calendar";

import PrevClick from "@icons/icon_byuckicon_chevron_left.svg?react";
import NextClick from "@icons/icon_byuckicon_chevron_right.svg?react";

import "react-calendar/dist/Calendar.css";
import "./index.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarUiProps {
  disabled?: boolean;
  disabledDates?: Date[];
  value?: Value;
  onChange?: (value: Value) => void;

  color?: string;
  fontSize?: string;
  width?: string;
  height?: string;
}

/**
 * Calendar UI 컴포넌트
 *
 * @param props - CalendarUiProps
 * @param props.disabled - 캘린더 전체 비활성화 여부 (기본값: false)
 * @param props.disabledDates - 비활성화할 날짜 배열 (기본값: [])
 * @param props.value - 선택된 날짜 값 (controlled component로 사용 시)
 * @param props.onChange - 날짜 선택 시 호출되는 콜백 함수
 * @param props.color - 텍스트 색상 (기본값: "#0a1811")
 * @param props.fontSize - 폰트 크기 (기본값: "14px")
 * @param props.width - 캘린더 너비 (기본값: "312px")
 * @param props.height - 캘린더 높이 (기본값: "100%")
 * @returns Calendar UI 컴포넌트
 *
 * @example
 * ```tsx
 * // Uncontrolled 사용
 * <CalendarUi disabledDates={[new Date()]} />
 *
 * // Controlled 사용
 * const [selectedDate, setSelectedDate] = useState<Date | null>(null);
 * <CalendarUi
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   disabledDates={[new Date()]}
 * />
 *
 * // 스타일 커스터마이즈
 * <CalendarUi
 *   color="#0058e4"
 *   fontSize="16px"
 *   width="400px"
 * />
 * ```
 */
const CalendarUi = ({
  disabled = false,
  disabledDates = [],
  value: propsValue,
  onChange: propsChange,

  color,
  fontSize,
  width,
  height,
}: CalendarUiProps) => {
  const [date, setDate] = useState<Value>(null);

  const value = propsValue !== undefined ? propsValue : date;
  const onChange = propsChange || setDate;

  // 주말 색상 체크
  const checkWeekend = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return;
    const day = date.getDay();

    if (day === 0) return "cal-sun";
    if (day === 6) return "cal-sat";
  };

  // 날짜 비교 헬퍼 함수
  const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // 해당 월의 모든 날짜가 disabled인지 확인
  const isMonthFullyDisabled = (date: Date): boolean => {
    if (disabledDates.length === 0) return false;

    const year = date.getFullYear();
    const month = date.getMonth();

    // 해당 월의 마지막 날 구하기
    const lastDay = new Date(year, month + 1, 0).getDate();

    // 해당 월의 모든 날짜 확인
    for (let day = 1; day <= lastDay; day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);

      // disabledDates에 포함되지 않은 날짜가 하나라도 있으면 false
      const isDisabled = disabledDates.some((disabledDate) => {
        const normalizedDisabledDate = new Date(disabledDate);
        normalizedDisabledDate.setHours(0, 0, 0, 0);
        return isSameDate(currentDate, normalizedDisabledDate);
      });

      if (!isDisabled) {
        return false; // 접근 가능한 날짜가 있음
      }
    }

    return true;
  };

  // 날짜 비활성화 체크
  const isDateDisabled = ({ date, view }: { date: Date; view?: string }) => {
    if (disabled) return true;
    if (disabledDates.length === 0) return false;

    // 월 선택 모드 (year view)에서는 해당 월의 모든 날짜가 disabled인지 확인
    if (view === "year") {
      return isMonthFullyDisabled(date);
    }

    // 일 선택 모드 (month view)에서는 개별 날짜만 확인
    return disabledDates.some((disabledDate) => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);

      const normalizedDisabledDate = new Date(disabledDate);
      normalizedDisabledDate.setHours(0, 0, 0, 0);

      return isSameDate(normalizedDate, normalizedDisabledDate);
    });
  };

  // 날짜 변경 핸들러
  const handleChange = (newValue: Value) => {
    if (!disabled) {
      onChange(newValue);
    }
  };

  // 타일 액션
  const tileAction = {
    checkDecade: (date: Date) => {
      const year = format(date, "yyyy", { locale: ko });

      return year;
    },
  };

  useEffect(() => {
    // 처음 선택이 오늘
    // 오늘이 disabled에 포함된 경우, 처음 선택을 null로 설정
    if (disabled && value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = Array.isArray(value) ? value[0] : value;

      if (selectedDate) {
        const dateToCheck = new Date(selectedDate);
        dateToCheck.setHours(0, 0, 0, 0);

        const isToday = dateToCheck.getTime() === today.getTime();

        if (isToday) {
          onChange(null);
        }
      }
    }

    if (disabled) {
      onChange(null);
    }
  }, [disabled, value, onChange]);

  const option: CalendarProps = {
    className: "custom-calendar",
    onChange: handleChange,
    value,
    calendarType: "gregory",
    locale: "ko-KR",
    minDetail: "decade",
    prev2Label: null,
    next2Label: null,
    prevLabel: <PrevClick width={24} height={24} />,
    nextLabel: <NextClick width={24} height={24} />,

    formatDay: (_, date) => format(date, "d", { locale: ko }),
    formatYear: (_, date) => format(date, "yyyy년", { locale: ko }),
    formatMonthYear: (_, date) => format(date, "yyyy년 MM월", { locale: ko }),
    formatMonth: (_, date) => format(date, "M", { locale: ko }),
    tileClassName: ({ date, view }) => checkWeekend({ date, view }),
    tileDisabled: isDateDisabled,

    tileContent: ({ date, view }) => {
      if (view === "decade") {
        return (
          <span className="decade-tile">{tileAction.checkDecade(date)}</span>
        );
      }
      return null;
    },
  };

  const calendarStyle: React.CSSProperties = {
    ...(color && { "--calendar-color": color }),
    ...(fontSize && { "--calendar-font-size": fontSize }),
    ...(width && { "--calendar-width": width }),
    ...(height && { "--calendar-height": height }),
  } as React.CSSProperties;

  return (
    <div
      className={disabled ? "custom-calendar-disabled" : ""}
      style={calendarStyle}
    >
      <Calendar {...option} />
    </div>
  );
};

export default CalendarUi;
