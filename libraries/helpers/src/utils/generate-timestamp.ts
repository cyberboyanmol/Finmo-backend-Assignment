import moment from 'moment-timezone';

export function generateTimestamp(milliseconds: number) {
  const currentTime = new Date();

  const futureTime = new Date(currentTime.getTime() + milliseconds);

  const timestamp = futureTime.toISOString();

  return timestamp;
}

