import * as dotenv from "dotenv";
dotenv.config();

const getEnv = (name: string): string => {
  const result = process.env[name];
  if (result === undefined) {
    throw new Error(`environment variable "${name}" not defined`);
  }
  return result;
};

const dynamoDbTableName = getEnv("dynamoDbTableName");
const defaultSlackChannel = getEnv("defaultSlackChannel");
const checkMailsAfter = getEnv("checkMailsAfter");
const gmailLabelId = getEnv("gmailLabelId");
const gmailLabelName = getEnv("gmailLabelName");
const gmailLambdaName = getEnv("gmailLambdaName");
const defaultRegion = getEnv("defaultRegion");

const dynamoDbKeyName = "id";
const utcOffset = 9;
const defaultSlackMessageERROR = "アラートメールを検知しました";
const defaultSlackMessageOK = "正常通知メールが一定時間以上届いていません";

export {
  dynamoDbTableName,
  defaultSlackChannel,
  checkMailsAfter,
  gmailLabelId,
  gmailLabelName,
  gmailLambdaName,
  defaultRegion,
  dynamoDbKeyName,
  utcOffset,
  defaultSlackMessageERROR,
  defaultSlackMessageOK
};
