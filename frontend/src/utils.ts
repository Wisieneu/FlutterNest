import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function convertDateRelative(date: string) {
  return dayjs().to(dayjs(date));
}

/**
 *
 * @param initialDate
 * @returns A date in the format "HH:MM PM/AM· DD MM YYYY"
 */
export function convertDateDetailed(initialDate: string) {
  const timeString12hr = new Date(initialDate).toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });
  const dateString = new Date(initialDate).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${timeString12hr} · ${dateString}`;
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

export function createImageUrl(fileName: string) {
  return `${process.env.REACT_APP_S3_BUCKET_URL}/${fileName}`;
}

export function useEffectSkipFirst(effect: React.EffectCallback, deps: any[]) {
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
    } else {
      effect();
    }
  }, deps);
}
