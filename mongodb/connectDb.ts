import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { dogstatsd } from "../logger/tracer";
import { LOGGER } from "../logger";
import { events } from "../constants/datadog";

dotenv.config();

const DB = process.env.MONGO_DB || "mongodb://";
const USER = process.env.MONGODB_USERNAME || "";
const PASSWORD = encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD || "");
const DB_NAME = process.env.MONGODB_DATABASE_NAME || "";
const HOST = process.env.MONGODB_HOST || "localhost";
const PORT = process.env.MONGODB_PORT || "27017";
const DB_MECHANISM = process.env.DB_MECHANISM || "?authMechanism=DEFAULT";

const cloudurl = `${DB}${USER}:${PASSWORD}@${HOST}/${DB_MECHANISM}`;
const dbUrl = DB_NAME === "local" ? `${DB}${USER}:${PASSWORD}@${HOST}:${PORT}/?authMechanism=DEFAULT` : cloudurl;

//console.log("DBURL", dbUrl);

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    const mongoDbConnection = await mongoose.connect(dbUrl);
    if (mongoDbConnection.connection.readyState === 1) {
      dogstatsd.increment(`${events.CONNECT_MONBODB}.success`, 1);
      LOGGER.info("connectDbDistributor:success");
      console.log("Connection success");
    } else {
      console.error("Connection failed");
      dogstatsd.increment(`${events.CONNECT_MONBODB}.error`, 1);
      LOGGER.error("connectDbDistributor:error");
    }
  } catch (error: any) {
    dogstatsd.increment(`${events.CONNECT_MONBODB}.error`, 1);
    LOGGER.error(`connectDbDistributor:${error.message}`);
    // setTimeout(connectDb, 5000);
  }
};

export { connectDb };
