import axios from "axios";
import dotenv from "dotenv";
import { LOGGER } from "../../logger";
import { dogstatsd } from "../../logger/tracer";
import { events } from "../../constants/datadog";

dotenv.config();

const CARDANO_PROJECT_ID = process.env.CARDANO_PROJECT_ID || "";
const URL_API =
  process.env.URL_API || "https://cardano-mainnet.blockfrost.io/api/v0";

const blockfrostAPI = axios.create({
  baseURL: URL_API,
  headers: {
    "Content-Type": "application/json",
    project_id: CARDANO_PROJECT_ID,
  },
});

const axiosRequest = async (options: any, caller?: string) => {
  try {
    LOGGER.info(`[axiosRequest][${caller}]`, { metadata: "", sendLog: false });
    const response = await axios(options);
    return response.data;
  } catch (error: any) {
    dogstatsd.increment(`${events.AXIOS_REQUEST}.error`, 1);

    LOGGER.error(`[axiosRequest][${caller}]`, { metadata: { error: error, stack: error.stack.toString() } });
    throw new Error(error.message);
  }
};
export interface Delegators {
  stakeAddress: string;
  amount: number;
}
export interface UserAsset {
  unit: string;
  quantity: number;
}

export const getStakeDistributionByPool = async (
  assigningEpochData: number,
  poolsId: string
): Promise<Delegators[]> => {
  try {
    const pageSize = 100; // Number of results per page
    let page = 1; // Starting page number
    let delegators: Delegators[] = []; // Array to store all addresses
    let whileLoop = true;

    while (whileLoop) {
      const options = {
        method: "get",
        url: `${URL_API}/epochs/${assigningEpochData}/stakes/${poolsId}`,
        headers: {
          "Content-Type": "application/json",
          project_id: CARDANO_PROJECT_ID,
        },
        params: {
          page,
          count: pageSize,
        },
      };

      const response = await axiosRequest(options);

      const currentDelegators: Delegators[] = response?.map((data: { stake_address: string, amount: string }) => ({
        stakeAddress: data.stake_address,
        amount: Number(data.amount),
      }));

      delegators = delegators.concat(currentDelegators);

      if (response.length < pageSize) {
        // Break the loop if the response is an empty array
        whileLoop = false;
      }

      page++; // Move to the next page
      sleep(100); // https://docs.blockfrost.io/#section/Limits
    }

    return delegators;
  } catch (error: any) {
    LOGGER.error(`[getStakeDistributionByPool][Error]`, { metadata: { error: error, stack: error.stack.toString() } });
    return [];
  }
};

// create a sleep function to avoid rate limit
const sleep = (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getAssetsAssociatedWithStakeAddresses = async (
  stake_address: string
): Promise<UserAsset[]> => {
  try {
    const pageSize = 100; // Number of results per page
    let page = 1; // Starting page number
    let assets: UserAsset[] = []; // Array to store all addresses
    let whileLoop = true;

    while (whileLoop) {
      const options = {
        method: "get",
        url: `${URL_API}/accounts/${stake_address}/addresses/assets`,
        headers: {
          "Content-Type": "application/json",
          project_id: CARDANO_PROJECT_ID,
        },
        params: {
          page,
          count: pageSize,
        },
      };

      const response = await axiosRequest(options);

      const currentAssets = response?.map((data: any) => ({
        unit: data.unit,
        quantity: Number(data.quantity),
      }));

      assets = assets.concat(currentAssets);

      if (response.length < pageSize) {
        // Break the loop if the response is an empty array
        whileLoop = false;
      }

      page++; // Move to the next page
      sleep(100); // https://docs.blockfrost.io/#section/Limits
    }

    return assets;
  } catch (error: any) {
    LOGGER.error(`[getAssetsAssociatedWithStakeAddresses][Error]`, {
      metadata: { error: error, stack: error.stack.toString() },
    });
    return [];
  }
};
