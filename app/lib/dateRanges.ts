import { toZonedTime } from "date-fns-tz";

export type DateRange = { fromDate: string; toDate: string };

export const getDayRangeLocal = (timeZone: string): DateRange => {
  const now = new Date();
  const startLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  return {
    fromDate: toZonedTime(startLocal, timeZone).toISOString(),
    toDate: toZonedTime(endLocal, timeZone).toISOString(),
  };
};

export const getTomorrowRangeLocal = (timeZone: string): DateRange => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const startLocal = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0);
  const endLocal = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59);

  return {
    fromDate: toZonedTime(startLocal, timeZone).toISOString(),
    toDate: toZonedTime(endLocal, timeZone).toISOString(),
  };
};

export const getWeekRangeLocal = (timeZone: string): DateRange => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 domingo, 1 lunes...
  const diffToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59);

  return {
    fromDate: toZonedTime(monday, timeZone).toISOString(),
    toDate: toZonedTime(sunday, timeZone).toISOString(),
  };
};

export const getMonthRangeLocal = (timeZone: string): DateRange => {
  const now = new Date();
  const startLocal = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const endLocal = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return {
    fromDate: toZonedTime(startLocal, timeZone).toISOString(),
    toDate: toZonedTime(endLocal, timeZone).toISOString(),
  };
};

export const getYearRangeLocal = (timeZone: string): DateRange => {
  const now = new Date();
  const startLocal = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
  const endLocal = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

  return {
    fromDate: toZonedTime(startLocal, timeZone).toISOString(),
    toDate: toZonedTime(endLocal, timeZone).toISOString(),
  };
};