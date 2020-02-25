import * as assert from "assert";
import * as myModule from "../src/index";
import * as mocha from "mocha";
import * as Types from "../src/types";
import moment from "moment";

describe("types guards", () => {
  describe("isConfigType", () => {
    it("test1", () => {
      const record = {
        id: "Something_error",
        errorType: 1,
        lastReceivedAt: "2020-02-21T10:00:00.000Z",
        lastCheckedAt: "2020-02-21T10:10:00.000Z",
        name: "Hogehoge連携ジョブエラー",
        query: 'from:jp1admin@examplecom subject:"Hogehogeジョブ 異常終了"',
        slackChannel: "#error_mails2"
      };

      assert.equal(Types.isConfigRecordType(record), true);
    });
  });
});

describe("types", () => {
  describe("configToMailType", () => {
    it("test1", () => {
      const record = {
        id: "Something_error",
        errorType: 1,
        lastReceivedAt: "2020-02-21T10:00:00.000Z",
        lastCheckedAt: "2020-02-21T10:10:00.000Z",
        name: "Hogehoge連携ジョブエラー",
        query: 'from:jp1admin@examplecom subject:"Hogehogeジョブ 異常終了"',
        slackChannel: "#error_mails2",
        slackMessage: "**エラーメールを検知しました"
      };
      if (!Types.isConfigRecordType(record)) {
        throw new Error("malformed record");
      }

      const result = Types.configToMailType(record);
      if (result.mailType !== "ERROR") {
        throw new Error("something wrong");
      }
      assert.equal(result.id, record.id);
      assert.equal(result.mailType, "ERROR");
      assert.equal(result.name, record.name);
      assert.equal(result.query, record.query);
      assert.equal(result.slackChannel, record.slackChannel);
      assert.equal(result.slackMessage, record.slackMessage);
      assert.equal(result.lastReceivedAt?.unix(), moment(record.lastReceivedAt).unix());
      assert.equal(result.lastCheckedAt?.unix(), moment(record.lastCheckedAt).unix());
    });

    it("test2", () => {
      const record = {
        id: "Something_OK",
        errorType: 2,
        lastReceivedAt: undefined,
        lastCheckedAt: "2020-02-21T10:10:00.000Z",
        name: "バックアップ成功",
        query: 'from:jp1admin@examplecom subject:"バックアップ正常終了"',
        slackChannel: "#error_mails2",
        slackMessage: "バックアップ成功メールが12時間の間届いていません",
        notifyAfter: 12
      };
      if (!Types.isConfigRecordType(record)) {
        throw new Error("malformed record");
      }
      const result = Types.configToMailType(record);
      if (result.mailType !== "OK") {
        throw new Error("something wrong");
      }
      assert.equal(result.id, record.id);
      assert.equal(result.mailType, "OK");
      assert.equal(result.name, record.name);
      assert.equal(result.query, record.query);
      assert.equal(result.slackChannel, record.slackChannel);
      assert.equal(result.slackMessage, record.slackMessage);
      assert.equal(result.notifyAfter, 12);
      assert.equal(result.lastReceivedAt, undefined);
      assert.equal(result.lastCheckedAt?.unix(), moment(record.lastCheckedAt).unix());
    });

    it("test3", () => {
      const record = {
        id: "Something_OK",
        errorType: 2,
        lastReceivedAt: "2020-02-21T10:00:00.000Z",
        name: "バックアップ成功",
        query: 'from:jp1admin@examplecom subject:"バックアップ正常終了"',
        slackChannel: "#error_mails2",
        slackMessage: "バックアップ成功メールが12時間の間届いていません",
        notifyAfter: 12
      };
      if (!Types.isConfigRecordType(record)) {
        throw new Error("malformed record");
      }
      const result = Types.configToMailType(record);
      if (result.mailType !== "OK") {
        throw new Error("something wrong");
      }
      assert.equal(result.id, record.id);
      assert.equal(result.mailType, "OK");
      assert.equal(result.name, record.name);
      assert.equal(result.query, record.query);
      assert.equal(result.slackChannel, record.slackChannel);
      assert.equal(result.slackMessage, record.slackMessage);
      assert.equal(result.notifyAfter, 12);
      assert.equal(result.lastReceivedAt?.unix(), moment(record.lastReceivedAt).unix());
      assert.equal(result.lastCheckedAt, undefined);
    });
  });
});
