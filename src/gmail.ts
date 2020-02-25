/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Types from "./types";
import * as env from "./env";
import * as AWS from "aws-sdk";
import moment from "moment";
import * as toolbox from "aws-toolbox";
import * as util from "./util";

const lambda = new AWS.Lambda({ region: env.defaultRegion });

/**
 * メールを検索してメールIDを取得する。自動的に日付・ラベルも検索条件に加えられる
 * @param query
 */
export const searchMailIds = async (query: string): Promise<Types.MailSearchResultType> => {
  const payload = {
    action: "search",
    condition: `after:${env.checkMailsAfter} -label:${env.gmailLabelName} (${query})`
  };

  console.log(`Gmail検索を行います: ${payload.condition}`);

  return await toolbox.lambda.invokeFunction(lambda, env.gmailLambdaName, payload, Types.isMailSearchResultType);
};

/**
 * メール本文を取得する
 * @param mailId
 */
export const getMail = async (mailId: string): Promise<Types.MailType> => {
  const payload = {
    action: "message",
    messageId: mailId
  };

  return await toolbox.lambda.invokeFunction(lambda, env.gmailLambdaName, payload, Types.isMailType);
};

/**
 * Lambdaを呼び出してメールにラベル（環境変数で指定された固定のもの）を付ける。処理終了は待たない
 * @param mailIds
 */
export const addLabelAsync = async (mailIds: string[]): Promise<void> => {
  for (const mailId of mailIds) {
    const payload = {
      action: "addLabels",
      messageId: mailId,
      labelIds: env.gmailLabelId
    };

    await lambda
      .invoke({
        FunctionName: env.gmailLambdaName,
        Payload: JSON.stringify(payload),
        InvocationType: "Event"
      })
      .promise();
  }
};

/**
 * メールをタイムスタンプで比較する
 * @param mail1
 * @param mail2
 */
export const compareMails = (mail1: Types.MailType, mail2: Types.MailType): number => {
  const timestamp1 = util.parseTimestamp(mail1.date) ?? moment("2001-01-01");
  const timestamp2 = util.parseTimestamp(mail2.date) ?? moment("2001-01-01");

  return timestamp1.diff(timestamp2, "second");
};

/**
 * 指定した検索条件でメールを探し、タイムスタンプ昇順（先頭が古く、末尾が最新）にソートして返す
 * @param query
 */
export const getMails = async (query: string): Promise<Types.MailType[]> => {
  const messageIds = await searchMailIds(query);

  const result: Types.MailType[] = [];
  for (const item of messageIds) {
    result.push(await getMail(item.id));
  }

  result.sort(compareMails);
  return result;
};
