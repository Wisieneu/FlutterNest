import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";
import { displayToast } from "./components/Toast";

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
  return isReachBottom;
}

export function catchToastError(functionToCatch: any) {
  try {
    functionToCatch();
  } catch (error) {
    displayToast(String(error), "error");
  }
}
