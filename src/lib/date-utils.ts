import { format, formatDistance, formatRelative } from "date-fns-jalali";

export const formatPersianDate = (
  date: string | Date | null | undefined,
  formatStr = "yyyy/MM/dd"
): string => {
  if (!date) return "تاریخ نامشخص";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "تاریخ نامعتبر";
  }
};

export const formatPersianRelativeTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "زمان نامشخص";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
    });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "زمان نامعتبر";
  }
};

export const formatPersianRelativeDate = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "تاریخ نامشخص";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatRelative(dateObj, new Date());
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return "تاریخ نامعتبر";
  }
};
