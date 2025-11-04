import { useState } from "react";
import moment from "moment";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import "./index.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarUi = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div>
      <Calendar
        className="custom-calendar"
        onChange={onChange}
        value={value}
        formatDay={(_, date) => moment(date).format("D")}
        formatYear={(_, date) => moment(date).format("YYYY")}
        formatMonthYear={(_, date) => moment(date).format("YYYY. MM")}
      />
    </div>
  );
};

export default CalendarUi;
