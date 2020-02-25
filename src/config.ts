import * as Types from "./types";
import * as env from "./env";
import * as AWS from "aws-sdk";
import * as toolbox from "aws-toolbox";
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: env.defaultRegion });

/**
 * DynamoDBから全レコードを取得して返す
 */
export const getAllConfigRecords = async (): Promise<Types.ConfigRecordType[]> => {
  const allRecords = await toolbox.dynamo.getAllRecords(dynamoDB, env.dynamoDbTableName);
  const notMathced = allRecords.filter(x => !Types.isConfigRecordType(x));
  if (notMathced.length > 0) {
    console.error(`不正な形式のレコードが${notMathced.length}件あります。処理は継続します`);
    for (const item of notMathced) {
      console.error(item);
    }
  }
  const matched = allRecords.filter<Types.ConfigRecordType>(Types.isConfigRecordType);
  return matched;
};

/**
 * DynamoDBからレコードを1件取得して返す
 * @param id
 */
export const getRecord = async (id: string): Promise<Types.ConfigRecordType> => {
  return await toolbox.dynamo.getSingleRecord(
    dynamoDB,
    env.dynamoDbTableName,
    env.dynamoDbKeyName,
    id,
    Types.isConfigRecordType
  );
};
