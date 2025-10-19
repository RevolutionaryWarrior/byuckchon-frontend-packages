interface CalendarMatrix {
  matrix: number[][];
  year: number;
  month: number;
  prevMonthDates: { [key: number]: string };
  nextMonthDates: { [key: number]: string };
}

export const createCalendarMatrix = (
  year: number,
  month: number,
  includeAdjacentMonths: boolean = false
): CalendarMatrix => {
  const firstDayDate = new Date(Date.UTC(year, month, 1));
  const firstDay = firstDayDate.getUTCDay();
  const lastDate = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const prevMonth = month - 1;
  const prevYear = prevMonth < 0 ? year - 1 : year;
  const adjustedPrevMonth = prevMonth < 0 ? 11 : prevMonth;
  const lastDayOfPrevMonth = new Date(
    Date.UTC(prevYear, adjustedPrevMonth + 1, 0)
  ).getUTCDate();

  const nextMonth = month + 1;
  const nextYear = nextMonth > 11 ? year + 1 : year;
  const adjustedNextMonth = nextMonth > 11 ? 0 : nextMonth;

  const matrix: number[][] = Array(6)
    .fill(null)
    .map(() => Array(7).fill(0));

  const prevMonthDates: { [key: number]: string } = {};
  const nextMonthDates: { [key: number]: string } = {};

  let date = 1;
  let nextMonthDate = 1;

  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      if (week === 0 && day < firstDay) {
        const prevDate = lastDayOfPrevMonth - (firstDay - day - 1);
        matrix[week][day] = includeAdjacentMonths ? -prevDate : 0;
        if (includeAdjacentMonths) {
          prevMonthDates[prevDate] = new Date(
            Date.UTC(prevYear, adjustedPrevMonth, prevDate)
          ).toISOString();
        }
      } else if (date <= lastDate) {
        matrix[week][day] = date++;
      } else {
        matrix[week][day] = includeAdjacentMonths ? -nextMonthDate : 0;
        if (includeAdjacentMonths) {
          nextMonthDates[nextMonthDate] = new Date(
            Date.UTC(nextYear, adjustedNextMonth, nextMonthDate)
          ).toISOString();
        }
        nextMonthDate++;
      }
    }
  }

  return { matrix, year, month, prevMonthDates, nextMonthDates };
};

export const getWeekFromMatrix = (
  matrix: number[][],
  year: number,
  month: number,
  targetDate: number,
  prevMonthDates: { [key: number]: string },
  nextMonthDates: { [key: number]: string }
): string[] => {
  let targetWeek = matrix.find((week) => week.includes(targetDate));

  if (!targetWeek && targetDate > 28) {
    targetWeek = matrix[matrix.length - 1];
  }

  if (!targetWeek) return [];

  return targetWeek.map((day) => {
    if (day > 0) {
      return new Date(Date.UTC(year, month, day)).toISOString();
    } else if (day < 0) {
      const absDay = Math.abs(day);
      return prevMonthDates[absDay] || nextMonthDates[absDay] || "0";
    }
    return "0";
  });
};

export const formatMatrixDates = (
  matrix: number[][],
  year: number,
  month: number,
  includeAdjacentMonths: boolean = false,
  prevMonthDates: { [key: number]: string } = {},
  nextMonthDates: { [key: number]: string } = {}
): string[][] => {
  return matrix.map((week) =>
    week.map((day) => {
      if (day > 0) {
        return new Date(Date.UTC(year, month, day)).toISOString();
      } else if (includeAdjacentMonths && day < 0) {
        const absDay = Math.abs(day);
        return prevMonthDates[absDay] || nextMonthDates[absDay] || "0";
      }
      return "0";
    })
  );
};
