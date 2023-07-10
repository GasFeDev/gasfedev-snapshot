import axios from "axios";
//import { axiosRequest } from "../helpers/polkadotHelpers";
import { LOGGER } from "../../logger";
import { dogstatsd } from "../../logger/tracer";
import { events } from "../../constants/datadog";
import dotenv from "dotenv";

dotenv.config();

const CARDANO_PROJECT_ID = process.env.CARDANO_PROJECT_ID || "";
const URL_API =
  process.env.URL_API || "https://cardano-mainnet.blockfrost.io/api/v0";

export const axiosRequest = async (options: any, caller?: string) => {
  try {
    LOGGER.info(`[axiosRequest][${caller}]`, { metadata: "" });
    const response = await axios(options);
    return response.data;
  } catch (error: any) {
    dogstatsd.increment(`${events.AXIOS_REQUEST}.error`, 1);

    LOGGER.error(`[axiosRequest][${caller}]`, { metadata: { error: error, stack: error.stack.toString() } });
    throw new Error(error.message);
  }
};

export type CardanoEpoch = {
  epoch: number;
  start_time: number;
  end_time: number;
  first_block_time: number;
  last_block_time: number;
  block_count: number;
  tx_count: number;
  output: string;
  fees: string;
  active_stake: string;
};

export const getCardanoCurrentEpoch = async () => {
  LOGGER.info(`[getCardanoCurrentEpoch][init current epoch]`, { metadata: "", sendLog: false });
  const options = {
    method: "get",
    url: `${URL_API}/epochs/latest`,
    headers: {
      "Content-Type": "application/json",
      project_id: CARDANO_PROJECT_ID,
    },
  };
  const response = await axiosRequest(options);
  const epoch: CardanoEpoch = {
    ...response,
    start_time: response.start_time * 1000,
    end_time: response.end_time * 1000,
  };
  return epoch;
};

export const getCardanoSpecificEpoch = async (epochNumber: number) => {
  LOGGER.info(`[getCardanoSpecificEpoch][init current specific epoch]`, {
    metadata: "",
    sendLog: false
  });

  const options = {
    method: "get",
    url: `${URL_API}/epochs/${epochNumber}`,
    headers: {
      "Content-Type": "application/json",
      project_id: CARDANO_PROJECT_ID,
    },
  };
  const response = await axiosRequest(options);
  const epoch: CardanoEpoch = {
    ...response,
    start_time: response.start_time * 1000,
    end_time: response.end_time * 1000,
  };
  return epoch;
};
