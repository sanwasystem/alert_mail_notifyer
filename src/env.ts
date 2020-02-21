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
const defaultRegion = getEnv("defaultRegion");
export { dynamoDbTableName, defaultRegion };
