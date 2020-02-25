// alert mail notifyer
// https://github.com/sanwasystem/alert_mail_notifyer

import * as LambdaType from "aws-lambda";
import * as gmail from "./gmail";
import * as Types from "./types";
import * as config from "./config";
import * as env from "./env";
import * as AWS from "aws-sdk";
import * as util from "./util";
import * as toolbox from "aws-toolbox";
import moment from "moment";

const dynamo = new AWS.DynamoDB.DocumentClient({ region: env.defaultRegion });

type ResultType = {
  latestTimestamp: moment.Moment | undefined;
  slackChannel: string;
  messages: object[];
};

/**
 * DynamoDBのレコードを更新し、メールに処理済みラベルを付ける
 * @param record
 * @param mails
 */
const complete = async (configRecord: Types.MailConfigType, mails: Types.MailType[]) => {
  // DynamoDBのレコードを読み直して更新
  const record = await config.getRecord(configRecord.id);
  // 最終チェック時刻を現在時刻で更新
  record.lastCheckedAt = util.now();
  // メールが1件以上あるなら最終受信時刻も更新
  if (mails.length > 0) {
    record.lastReceivedAt = moment(mails[mails.length - 1].date)
      .utcOffset(env.utcOffset)
      .format();
  }
  await dynamo
    .put({
      TableName: env.dynamoDbTableName,
      Item: record
    })
    .promise();

  // メールにラベル追加
  await gmail.addLabelAsync(mails.map(x => x.id));
};

export const processErrorMails = async (record: Types.ErrorMailConfig): Promise<void> => {
  const mails = await gmail.getMails(record.query);

  // TODO: Slackにメッセージ送信

  await complete(record, mails);
};

export const processOkMails = async (record: Types.OkMailConfig): Promise<ResultType> => {
  const mails = await gmail.getMails(record.query);

  if (mails.length === 0 && record.lastReceivedAt !== undefined) {
    // メールがまだ来ていない
    const elapsedInHours = moment().diff(record.lastReceivedAt, "hours");
    if (elapsedInHours >= record.notifyAfter) {
      // TODO: アラートを出す
    }

    return {
      latestTimestamp: undefined,
      slackChannel: record.slackChannel,
      messages: []
    };
  }

  // 最新のOKメール
  const latest = mails[mails.length - 1];
  throw new Error("not implemented");
};

export const process = async () => {
  const records = await config.getAllConfigRecords();

  for (const record of records) {
    const _record = Types.configToMailType(record);
    switch (_record.mailType) {
      case "ERROR":
        await processErrorMails(_record);
        break;

      case "OK":
        await processOkMails(_record);
        break;

      default:
        util.neverComesHere(_record);
    }
  }
};
