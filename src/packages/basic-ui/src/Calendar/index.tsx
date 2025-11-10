import { useState } from "react";
import moment from "moment";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import "./index.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarUi = () => {
  const [value, onChange] = useState<Value>(new Date());

  const checkWeekend = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return;
    const day = date.getDay();

    if (day === 0) return "cal-sun";
    if (day === 6) return "cal-sat";
  };

  return (
    <div>
      <Calendar
        className="custom-calendar"
        onChange={onChange}
        value={value}
        calendarType="gregory"
        locale="ko-KR"
        formatDay={(_, date) => moment(date).format("D")}
        formatYear={(_, date) => moment(date).format("YYYY")}
        formatMonthYear={(_, date) => moment(date).format("YYYY. MM")}
        tileClassName={checkWeekend}
      />
    </div>
  );
};

export default CalendarUi;
