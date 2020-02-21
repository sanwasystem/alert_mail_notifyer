import moment from "moment";
import * as env from "../env";
import * as util from "../util";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MailConfigBase {
  id: string;
  name: string;
  query: string;
  slackChannel: string;
  slackMessage: string;
  lastReceivedAt: moment.Moment;
}

export interface ErrorMailConfig extends MailConfigBase {
  mailType: "ERROR";
}

export interface OkMailConfig extends MailConfigBase {
  mailType: "OK";
  notifyAfter: number;
}

export type ConfigRecordType = {
  id: string;
  /**
   * メールの種別。エラーメール（届いたら通知）なら1, 正常通知メール（届かなかったら通知）なら2
   */
  errorType: 1 | 2;

  /**
   * システム的には参照しない。メールのグループ分けに使う
   */
  group?: string;
  /**
   * エラーメール・正常通知メールの名称。Slackにも通知される
   */
  name: string;
  /**
   * メールを検索するための条件
   */
  query: string;
  /**
   * アラート通知先のSlackチャンネル名。省略時は環境変数で設定されたデフォルト値を使う
   */
  slackChannel?: string;
  /**
   * Slackに通知する文言。省略時は「アラートメールを検知しました」になる
   */
  slackMessage?: string;

  /**
   * 正常通知メールが何時間届かなかったらアラートを出すかを指定する。errorTypeが2のときにのみ意味を持つ。省略時は25時間
   */
  notifyAfter?: number;

  /**
   * 最後にこのメールが届いたときの日時
   */
  lastReceivedAt?: string;
};

export const isConfigRecordType = (arg: any): arg is ConfigRecordType => {
  if (arg === null) {
    return false;
  }
  if (typeof arg.id !== "string") {
    return false;
  }
  if (typeof arg !== "object") {
    return false;
  }
  if (arg.errorType !== 1 && arg.errorType !== 2) {
    return false;
  }
  if (arg.group !== undefined && typeof arg.group !== "string") {
    return false;
  }
  if (typeof arg.name !== "string") {
    return false;
  }
  if (typeof arg.query !== "string") {
    return false;
  }
  if (arg.slackChannel !== undefined && typeof arg.slackChannel !== "string") {
    return false;
  }
  if (arg.slackMessage !== undefined && typeof arg.slackMessage !== "string") {
    return false;
  }
  if (arg.notifyAfter !== undefined && typeof arg.notifyAfter !== "number") {
    return false;
  }
  if (arg.lastReceivedAt !== undefined && typeof arg.lastReceivedAt !== "string") {
    return false;
  }
  return true;
};

export const configToMailType = (config: ConfigRecordType): ErrorMailConfig | OkMailConfig => {
  let lastReceivedAt: moment.Moment;
  try {
    lastReceivedAt = moment(config.lastReceivedAt);
  } catch (e) {
    lastReceivedAt = moment();
  }

  const base = {
    id: config.id,
    name: config.name,
    query: config.query,
    slackChannel: config.slackChannel ?? env.defaultSlackChannel,
    lastReceivedAt: lastReceivedAt
  };

  switch (config.errorType) {
    case 1:
      return {
        ...base,
        mailType: "ERROR",
        slackMessage: config.slackMessage ?? env.defaultSlackMessageERROR
      };

    case 2: {
      const notifyAfter = config.notifyAfter ?? 25;
      const defaultSlackMessage = `${env.defaultSlackMessageOK} (${notifyAfter}時間以上)`;
      return {
        ...base,
        mailType: "OK",
        notifyAfter: notifyAfter,
        slackMessage: config.slackMessage ?? defaultSlackMessage
      };
    }

    default:
      return util.neverComesHere(config.errorType);
  }
};
