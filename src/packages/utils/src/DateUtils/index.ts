import {
  isAfter as dfIsAfter,
  isBefore as dfIsBefore,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format,
  formatISO,
  parse,
} from "date-fns";

/** utc -> kst 시간 변환 함수 */
export const utcToKst = (utcDate: Date): Date => {
  const timezoneOffset = 9 * 60 * 60 * 1000;

  return new Date(utcDate.getTime() + timezoneOffset);
};

/** 날짜 형식 변환 함수 ( ex: yyyy-MM-dd ) */
export const formatDate = (
  date: Date | string,
  pattern: string = "yyyy-MM-dd"
): string => {
  const dateObject = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObject.getTime())) {
    throw new Error("올바른 날짜 형식이 아닙니다.");
  }

  return format(dateObject, pattern);
};

/** 날짜 ISO 형식 변환 함수  */
export const toISO = (date: Date): string => {
  return formatISO(date);
};

/** 날짜 파싱 함수 */
export const parseDate = (date: string, pattern?: string): Date => {
  return parse(date, pattern ?? "yyyy-MM-dd", new Date());
};

/** 이전 날짜 반환 함수 */
export const beforeDate = (firstDate: Date, secondDate: Date): Date => {
  return dfIsBefore(firstDate, secondDate) ? firstDate : secondDate;
};

/** 이후 날짜 반환 함수 */
export const afterDate = (firstDate: Date, secondDate: Date): Date => {
  return dfIsAfter(firstDate, secondDate) ? firstDate : secondDate;
};

/** 현재 시간을 기준으로 상대 시간 반환 함수 */
export const relativeTime = (
  date: Date,
  labels?: Partial<
    Record<
      | "direction"
      | "seconds"
      | "minutes"
      | "hours"
      | "days"
      | "weeks"
      | "months"
      | "years",
      string
    >
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
    {
      diffFunc: differenceInMinutes,
      limit: 60,
      label: TIME_UNIT_LABELS.minutes,
    },
    { diffFunc: differenceInHours, limit: 24, label: TIME_UNIT_LABELS.hours },
    { diffFunc: differenceInDays, limit: 7, label: TIME_UNIT_LABELS.days },
    { diffFunc: differenceInWeeks, limit: 5, label: TIME_UNIT_LABELS.weeks },
    { diffFunc: differenceInMonths, limit: 12, label: TIME_UNIT_LABELS.months },
    {
      diffFunc: differenceInYears,
      limit: Infinity,
      label: TIME_UNIT_LABELS.years,
    },
  ];

  for (const timeUnit of timeUnits) {
    const diff = Math.abs(timeUnit.diffFunc(now, date));

    if (diff >= 1 && diff < timeUnit.limit)
      return `${diff}${timeUnit.label} ${TIME_UNIT_LABELS.direction}`;
  }

  return isAgo
    ? `${TIME_UNIT_LABELS.seconds} ${TIME_UNIT_LABELS.direction}`
    : `${TIME_UNIT_LABELS.seconds} ${TIME_UNIT_LABELS.direction}`;
};
