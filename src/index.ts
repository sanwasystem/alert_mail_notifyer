// alert mail notifyer
// https://github.com/sanwasystem/alert_mail_notifyer

import * as LambdaType from "aws-lambda";
import * as gmail from "./gmail";
import * as Types from "./types";
import * as config from "./config";
import * as env from "./env";
import * as AWS from "aws-sdk";

exports.handler = async (event: any, context: LambdaType.Context) => {
  for (const record of await config.getAllConfigRecords()) {
    const messageIds = await gmail.searchMailIds(record.query);
    console.log(messageIds);
  }
};
