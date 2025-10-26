import {
  format,
  formatISO,
  parse,
  isBefore as dfIsBefore,
  isAfter as dfIsAfter,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export const utcToKst = (utcDate: Date): Date => {
  const timezoneOffset = 9 * 60 * 60 * 1000;

  return new Date(utcDate.getTime() + timezoneOffset);
};

export const formatData = (date: Date, pattern: string = "yyyy-MM-dd"): string => {
  return format(date, pattern);
};

export const toISO = (date: Date): string => {
  return formatISO(date);
};

export const parseDate = (date: string): Date => {
  return parse(date, "yyyy-MM-dd", new Date());
};

export const beforeDate = (firstDate: Date, secondDate: Date): Date => {
  return dfIsBefore(firstDate, secondDate) ? firstDate : secondDate;
};

export const afterDate = (firstDate: Date, secondDate: Date): Date => {
  return dfIsAfter(firstDate, secondDate) ? firstDate : secondDate;
};

export const relativeTime = (
  date: Date,
  labels?: Partial<
    Record<"direction" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years", string>
  >
): string => {
  const now = new Date();
  const isAgo = now >= date;
  const defaultLabels = {
    direction: isAgo ? "전" : "후",
    seconds: isAgo ? "방금" : "잠시",
    minutes: "분",
    hours: "시간",
    days: "일",
    weeks: "주",
    months: "개월",
    years: "년",
  };
  const TIME_UNIT_LABELS = { ...defaultLabels, ...labels };

  const timeUnits = [
    { diffFunc: differenceInMinutes, limit: 60, label: TIME_UNIT_LABELS.minutes },
    { diffFunc: differenceInHours, limit: 24, label: TIME_UNIT_LABELS.hours },
    { diffFunc: differenceInDays, limit: 7, label: TIME_UNIT_LABELS.days },
    { diffFunc: differenceInWeeks, limit: 5, label: TIME_UNIT_LABELS.weeks },
    { diffFunc: differenceInMonths, limit: 12, label: TIME_UNIT_LABELS.months },
    { diffFunc: differenceInYears, limit: Infinity, label: TIME_UNIT_LABELS.years },
  ];

  for (const timeUnit of timeUnits) {
    const diff = Math.abs(timeUnit.diffFunc(now, date));

    if (diff >= 1 && diff < timeUnit.limit) return `${diff}${timeUnit.label} ${TIME_UNIT_LABELS.direction}`;
  }

  return isAgo
    ? `${TIME_UNIT_LABELS.seconds} ${TIME_UNIT_LABELS.direction}`
    : `${TIME_UNIT_LABELS.seconds} ${TIME_UNIT_LABELS.direction}`;
};
