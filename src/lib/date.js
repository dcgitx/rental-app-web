import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

/**
 * Format a date with Day.js
 * @param {string|Date} date - the input date
 * @param {string} format - custom format or "relative"
 * @returns {string}
 */
export function formatDate(date, format = "Do MMMM YYYY") {
    if (!date) return "";

    const d = dayjs(date);

    if (format === "relative") {
        const now = dayjs();
        const diffSeconds = d.diff(now, "seconds");

        // If the diff is slightly in the future (<5s), treat as now
        if (diffSeconds > 0 && diffSeconds < 5) {
            return now.fromNow();
        }

        return d.fromNow();
    }

    return d.format(format);
}
