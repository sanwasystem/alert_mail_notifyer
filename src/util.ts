import moment from "moment";
import * as env from "./env";

export const now = (): string => {
  return moment()
    .utcOffset(env.utcOffset)
    .format();
};

export const parseTimestamp = (timestamp: string | undefined): moment.Moment | undefined => {
  if (timestamp === undefined) {
    return undefined;
  }
  try {
    return moment(timestamp);
  } catch (e) {
    return undefined;
  }
};

export const neverComesHere = (arg: never): never => {
  throw new Error(arg);
};
