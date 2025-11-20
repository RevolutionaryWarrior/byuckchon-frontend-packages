import { useState, useEffect } from "react";
import moment from "moment";

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
}

/**
 * Calendar UI 컴포넌트
 *
 * @param props - CalendarUiProps
 * @param props.disabled - 캘린더 전체 비활성화 여부 (기본값: false)
 * @param props.disabledDates - 비활성화할 날짜 배열 (기본값: [])
 * @param props.value - 선택된 날짜 값 (controlled component로 사용 시)
 * @param props.onChange - 날짜 선택 시 호출되는 콜백 함수
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
 * ```
 */
const CalendarUi = ({
  disabled = false,
  disabledDates = [],
  value: propsValue,
  onChange: propsChange,
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

  // 날짜 비활성화 체크
  const isDateDisabled = ({ date }: { date: Date }) => {
    if (disabled) return true;
    if (disabledDates.length === 0) return false;

    return disabledDates.some((disabledDate) => {
      return (
        date.getDate() === disabledDate.getDate() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getFullYear() === disabledDate.getFullYear()
      );
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
    checkMonth: (date: Date) => {
      const day = date.getDate();
      return day;
    },
    checkYear: (date: Date) => {
      const year = moment(date).format("M");

      return year;
    },
    checkDecade: (date: Date) => {
      const year = moment(date).format("YYYY");

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
    formatDay: (_, date) => moment(date).format("D"),
    formatYear: (_, date) => moment(date).format("YYYY년"),
    formatMonthYear: (_, date) => moment(date).format("YYYY년 MM월"),
    formatMonth: (_, date) => moment(date).format("M"),
    tileClassName: ({ date, view }) => checkWeekend({ date, view }),
    tileDisabled: isDateDisabled,
  };

  return (
    <div className={disabled ? "custom-calendar-disabled" : ""}>
      <Calendar
        {...option}
        tileContent={({ date, view }) => {
          if (view === "decade") {
            return (
              <span className="decade-tile">
                {tileAction.checkDecade(date)}
              </span>
            );
          }
          return null;
        }}
      />
    </div>
  );
};

export default CalendarUi;
