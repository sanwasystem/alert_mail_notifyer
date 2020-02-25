/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * メール検索結果
 */
export type MailSearchResultType = {
  id: string;
  threadId: string;
}[];

export const isMailSearchResultType = (arg: any): arg is MailSearchResultType => {
  if (!Array.isArray(arg)) {
    return false;
  }
  return arg.every(x => typeof x.id === "string" && typeof x.threadId === "string");
};

/**
 * メールの内容
 */
export type MailType = {
  id: string;
  threadId: string;
  subject: string;
  contentType: string;
  /**
   * メッセージID。Rfc822msgidクエリで検索できる
   */
  messageId: string;
  snippet: string;
  date: string;
  labelIds: string[];
  body: string;
  body2: string;

  attachments: {
    filename: string;
    mimeType: string;
    base64: string;
    size: number;
  }[];

  isTextMail: boolean;
  from: string;
  to: string;
};

export const isMailType = (arg: any): arg is MailType => {
  if (arg === null || typeof arg !== "object") {
    return false;
  }
  if (typeof arg.id !== "string") {
    return false;
  }
  if (typeof arg.threadId !== "string") {
    return false;
  }
  if (typeof arg.subject !== "string") {
    return false;
  }
  if (typeof arg.contentType !== "string") {
    return false;
  }
  if (typeof arg.messageId !== "string") {
    return false;
  }
  if (typeof arg.snippet !== "string") {
    return false;
  }
  if (typeof arg.date !== "string") {
    return false;
  }
  if (!Array.isArray(arg.labelIds) || arg.labelIds.some((x: any) => typeof x !== "string")) {
    return false;
  }
  if (typeof arg.body !== "string") {
    return false;
  }
  if (typeof arg.body2 !== "string") {
    return false;
  }
  // TODO: attachments
  if (typeof arg.isTextMail !== "boolean") {
    return false;
  }
  if (typeof arg.from !== "string") {
    return false;
  }
  if (typeof arg.to !== "string") {
    return false;
  }
  if (typeof arg.returnPath !== "string") {
    return false;
  }

  return true;
};
