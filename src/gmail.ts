/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Types from "./types";
import * as env from "./env";
import * as AWS from "aws-sdk";
import moment from "moment";
import * as toolbox from "aws-toolbox";
const lambda = new AWS.Lambda({ region: env.defaultRegion });

export const searchMailIds = async (query: string): Promise<Types.MailSearchResultType> => {
  const payload = {
    action: "search",
    condition: `after:${env.checkMailsAfter} -label:${env.gmailLabelName} (${query})`
  };

  console.log(`Gmail検索を行います: ${payload.condition}`);

  return await toolbox.lambda.invokeFunction(lambda, env.gmailLambdaName, payload, Types.isMailSearchResultType);
};

export const getMail = async (mailId: string): Promise<Types.MailType> => {
  const payload = {
    action: "message",
    messageId: mailId
  };

  return await toolbox.lambda.invokeFunction(lambda, env.gmailLambdaName, payload, Types.isMailType);
};

export const addLabel = async (mailId: string): Promise<void> => {
  const payload = {
    action: "addLabels",
    messageId: mailId,
    labelIds: env.gmailLabelId
  };

  await lambda
    .invoke({
      FunctionName: env.gmailLambdaName,
      Payload: JSON.stringify(payload)
    })
    .promise();
};

/**
 * メールをタイムスタンプで比較する
 * @param mail1
 * @param mail2
 */
export const compareMails = (mail1: Types.MailType, mail2: Types.MailType): number => {
  let timestamp1 = moment("2001-01-01");
  let timestamp2 = moment("2001-01-01");
  try {
    timestamp1 = moment(mail1.date);
  } catch (e) {}
  try {
    timestamp2 = moment(mail2.date);
  } catch (e) {}

  return timestamp1.diff(timestamp2, "second");
};

/**
 * 指定した検索条件でメールを探し、タイムスタンプ昇順（先頭が古く、末尾が最新）にソートして返す
 * @param query
 */
export const getMails = async (query: string) => {
  const messageIds = await searchMailIds(query);

  const result: Types.MailType[] = [];
  for (const item of messageIds) {
    result.push(await getMail(item.id));
  }

  result.sort(compareMails);
  return result;
};
