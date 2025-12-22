export interface FormatTimeOptions {
  use12Hour?: boolean;
  showPeriod?: boolean;
  showSeconds?: boolean;
  includeDate?: boolean;
  includeWeekday?: boolean;
  timeSeparator?: string;
  dateFormat?: string;
  dateTimeSeparator?: string;
  padHours?: boolean;
  periodLabels?: {
    am?: string;
    pm?: string;
  };
  weekdayLabels?: string[];
}
