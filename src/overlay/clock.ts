export interface ClockDisplay {
  time: string; // e.g. "9:41"
  ampm: string; // "AM" | "PM"
}

/** 12-hour clock, no leading zero on the hour - matches the Nest Hub look. */
export function getClockDisplay(date: Date = new Date()): ClockDisplay {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours24 < 12 ? "AM" : "PM";
  return { time: `${hours12}:${minutes}`, ampm };
}
