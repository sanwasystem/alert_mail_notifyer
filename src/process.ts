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

export const processErrorMails = async (record: Types.ErrorMailConfig): Promise<ResultType> => {
  const mails = await gmail.getMails(record.query);

  throw new Error("not implemented");
};

export const processOkMails = async (record: Types.OkMailConfig): Promise<ResultType> => {
  const mails = await gmail.getMails(record.query);

  if (mails.length === 0) {
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
        processErrorMails(_record);
        break;

      case "OK":
        processOkMails(_record);
        break;

      default:
        util.neverComesHere(_record);
    }

    // 最新のレコードを取る
    const recordToPut = { ...record };
    recordToPut.lastCheckedAt = moment()
      .utcOffset(env.utcOffset)
      .format();
  }
};
