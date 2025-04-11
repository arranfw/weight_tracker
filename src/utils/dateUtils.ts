import {
  LocalDateTime,
  ZonedDateTime,
  ZoneId,
  DateTimeFormatter,
  Instant,
} from "@js-joda/core";
import "@js-joda/timezone";
import { Locale } from "@js-joda/locale_en";

// Register the locale
const US_LOCALE = Locale.US;

/**
 * Format a JavaScript Date to a localized date string using js-joda
 * @param date JavaScript Date object
 * @param pattern Format pattern (default: 'MMM d')
 * @returns Formatted date string
 */
export function formatDate(date: Date, pattern = "MMM d"): string {
  // Convert JavaScript date to js-joda Instant
  const instant = Instant.ofEpochMilli(date.getTime());

  // Convert to ZonedDateTime in the system default timezone
  const zonedDateTime = ZonedDateTime.ofInstant(
    instant,
    ZoneId.systemDefault(),
  );

  // Format with the provided pattern
  return zonedDateTime.format(
    DateTimeFormatter.ofPattern(pattern).withLocale(US_LOCALE),
  );
}

/**
 * Format a JavaScript Date to a full date/time string
 * @param date JavaScript Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return formatDate(date, "MMM d, yyyy h:mm a");
}

/**
 * Format a LocalDateTime for datetime-local input
 * @param localDateTime js-joda LocalDateTime
 * @returns Formatted string in the format required by datetime-local input
 */
export function formatDateTimeForInput(localDateTime: LocalDateTime): string {
  return localDateTime.format(
    DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"),
  );
}

/**
 * Convert js-joda LocalDateTime to JavaScript Date
 * @param localDateTime js-joda LocalDateTime
 * @returns JavaScript Date object
 */
export function dateTimeToJsDate(localDateTime: LocalDateTime): Date {
  // First convert to a ZonedDateTime in the system default time zone
  const zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
  // Then convert to an instant (point in time)
  const instant = zonedDateTime.toInstant();
  // Finally convert to milliseconds since epoch and create a JavaScript Date
  return new Date(instant.toEpochMilli());
}

/**
 * Convert a JavaScript Date to js-joda LocalDateTime
 * @param date JavaScript Date object
 * @returns js-joda LocalDateTime
 */
export function jsDateToDateTime(date: Date): LocalDateTime {
  // Convert to Instant first
  const instant = Instant.ofEpochMilli(date.getTime());
  // Then to ZonedDateTime in the default time zone
  const zonedDateTime = ZonedDateTime.ofInstant(
    instant,
    ZoneId.systemDefault(),
  );
  // Finally extract the LocalDateTime component
  return zonedDateTime.toLocalDateTime();
}

/**
 * Parse an ISO date string to a LocalDateTime
 * @param dateStr ISO date string
 * @returns js-joda LocalDateTime
 */
export function parseISOToDateTime(dateStr: string): LocalDateTime {
  // For datetime-local input values
  if (dateStr.includes("T")) {
    return LocalDateTime.parse(
      dateStr,
      DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"),
    );
  }
  // For date-only inputs
  return LocalDateTime.parse(
    dateStr,
    DateTimeFormatter.ofPattern("yyyy-MM-dd"),
  );
}

/**
 * Get the current date and time
 * @returns Current LocalDateTime
 */
export function now(): LocalDateTime {
  return LocalDateTime.now();
}
