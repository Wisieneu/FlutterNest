import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function convertDateRelative(date: string) {
  return dayjs().to(dayjs(date));
}

/**
 * Detects when the user has scrolled to the bottom of the page
 * and calls the @argument
 */
export function isScrolledToBottom() {
  const scrolledTo = window.scrollY + window.innerHeight;
  const isReachBottom = document.body.scrollHeight - scrolledTo <= 1;
  console.log(isReachBottom, document.body.scrollHeight, scrolledTo);
  return isReachBottom;
}
