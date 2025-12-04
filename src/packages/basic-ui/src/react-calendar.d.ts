declare module "react-calendar" {
  import { ComponentType } from "react";

  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  export interface CalendarProps {
    className?: string;
    onChange?: (value: Value) => void;
    value?: Value;
    calendarType?: "gregory" | "hebrew" | "islamic" | "iso8601";
    locale?: string;
    minDetail?: "century" | "decade" | "year" | "month";
    prev2Label?: React.ReactNode | null;
    next2Label?: React.ReactNode | null;
    prevLabel?: React.ReactNode;
    nextLabel?: React.ReactNode;
    formatDay?: (locale: string | undefined, date: Date) => string;
    formatYear?: (locale: string | undefined, date: Date) => string;
    formatMonthYear?: (locale: string | undefined, date: Date) => string;
    formatMonth?: (locale: string | undefined, date: Date) => string;
    tileClassName?: (props: {
      date: Date;
      view: string;
    }) => string | null | undefined;
    tileDisabled?: (props: { date: Date; view?: string }) => boolean;
    tileContent?: (props: { date: Date; view: string }) => React.ReactNode;
    showNavigation?: boolean;
    activeStartDate?: Date;
    onActiveStartDateChange?: (props: { activeStartDate: Date | null }) => void;
  }

  const Calendar: ComponentType<CalendarProps>;
  export default Calendar;
}
