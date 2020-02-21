export const neverComesHere = (arg: never): never => {
  throw new Error(arg);
};
