import { BigNumber } from 'ethers';

export async function delay(minutes: number): Promise<void> {
  const milliseconds = minutes * 60 * 1000; // Convert minutes to milliseconds
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function calculatePercentOfBigNumber(
  bigNumber: BigNumber,
  percent: number,
) {
  const percentAsBigNumber = BigNumber.from(percent);
  return bigNumber.mul(percentAsBigNumber).div(100);
}
export const findKeyByValue = (obj: any, value: any) =>
  (Object.keys(obj) as (keyof typeof obj)[]).find((key) => obj[key] === value);

export function truncate(address: string): string {
  return `${address.substring(0, 4)}...${address.slice(-4)}`;
}

export function formatCamelCase(s: string): string {
  let words = s.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

  words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return words.join(' ');
}

export function compare(a: string, b: string) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  let mismatch = a.length === b.length ? 0 : 1;
  if (mismatch) {
    b = a;
  }

  for (let i = 0, il = a.length; i < il; ++i) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
}

export function getRandomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap elements at i and randomIndex
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

export function convertCronExpr(cronExpr: string, currentDate = new Date()) {
  let [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpr
    .split(' ')
    .map((x) => (x === '*' ? '*' : parseInt(x)));

  // Start with setting the date to the first of the current month and time to 00:00
  const nextDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
    0,
    0,
    0,
  );

  // Process month
  month = month !== '*' ? month - 1 : nextDate.getMonth();
  nextDate.setMonth(month);

  // If month has passed, increment the year
  if (nextDate.getMonth() < currentDate.getMonth()) {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  }

  // Process day of the month
  dayOfMonth = dayOfMonth !== '*' ? dayOfMonth : nextDate.getDate();
  nextDate.setDate(dayOfMonth);

  // If day has passed in the month, increment the month
  if (
    nextDate.getDate() < currentDate.getDate() &&
    nextDate.getMonth() === currentDate.getMonth()
  ) {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  // Process day of the week
  if (dayOfWeek !== '*') {
    while (nextDate.getDay() !== dayOfWeek) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
  }

  // Process hour
  hour = hour !== '*' ? hour : nextDate.getHours();
  nextDate.setHours(hour);

  // If hour has passed in the day, increment the day
  if (
    nextDate.getHours() < currentDate.getHours() &&
    nextDate.getDate() === currentDate.getDate()
  ) {
    nextDate.setDate(nextDate.getDate() + 1);
  }

  // Process minute
  minute = minute !== '*' ? minute : nextDate.getMinutes();
  nextDate.setMinutes(minute);

  // If minute has passed in the hour, increment the hour
  if (
    nextDate.getMinutes() < currentDate.getMinutes() &&
    nextDate.getHours() === currentDate.getHours()
  ) {
    nextDate.setHours(nextDate.getHours() + 1);
  }

  return nextDate;
}
