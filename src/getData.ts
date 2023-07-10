import { cardanoSnapshot } from "./snapshotLogic";
import dotenv from "dotenv";
import { LOGGER } from "../logger";
import mongoose from "mongoose";
import {
  cardanoSnapshotAddressExclude,
  cardanoSnapshotAddressExcludeByEpoch,
} from "./snapshotExclude";
import {
  getCardanoCurrentEpoch,
} from "./helpers/cardanoHelpers";

dotenv.config();

const CardanoSpecificEpoch = process.env.POOL_ID?.split(",") || [""];

export const executeSnapshotCardano = async (
  poolsId: string[],
  assigningEpochData: number
) => {
  try {
    LOGGER.info(
      `[executeSnapshotCardano][Init for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: "", sendLog: true }
    );

    for (const poolId of poolsId) {
      LOGGER.info(
        `[executeSnapshotCardano][run for pool: ${JSON.stringify(poolId)}]`,
        { metadata: "", sendLog: true }
      );
      const currentBatchId = new mongoose.Types.ObjectId().toString();
      await cardanoSnapshot(currentBatchId, poolId, assigningEpochData);

      LOGGER.info(
        `[executeSnapshotCardano][reward success for pool: ${JSON.stringify(
          poolId
        )}]`,
        { metadata: "", sendLog: true }
      );
    }
    LOGGER.info(
      `[executeSnapshotCardano][Finish for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: "", sendLog: true }
    );
  } catch (error: any) {
    //dogstatsd.increment(`${events.EXECUTE_CARDANO_POOL_REWARD}.error}`);
    LOGGER.error(
      `[executeSnapshotCardano][error for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: { error: error, stack: error.stack.toString() } }
    );

    return error;
  }
};

export const excludeSnapshotAddressesDelegators = async (
  poolsId: string[],
  assigningEpochData: number
) => {
  try {
    LOGGER.info(
      `[excludeSnapshotCardano][Init for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: "", sendLog: false }
    );

    for (const poolId of poolsId) {
      LOGGER.info(
        `[excludeSnapshotCardano][run for pool: ${JSON.stringify(poolId)}]`,
        { metadata: "", sendLog: false }
      );
      await cardanoSnapshotAddressExclude(poolId, assigningEpochData);

      LOGGER.info(
        `[excludeSnapshotCardano][exclude success for pool: ${JSON.stringify(
          poolId
        )}]`,
        { metadata: "", sendLog: false }
      );
    }
    LOGGER.info(
      `[excludeSnapshotCardano][Finish for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: "", sendLog: false }
    );
  } catch (error: any) {
    //dogstatsd.increment(`${events.exclude_CARDANO_POOL_REWARD}.error}`);
    LOGGER.error(
      `[excludeSnapshotCardano][error for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: error }
    );

    return error;
  }
};

export const excludeSnapshotAddressesDelegatorsByEpoch = async (
  epoch: number,
  poolsId: string[]
) => {
  try {
    LOGGER.info(
      `[excludeSnapshotAddressesDelegatorsByEpoch][Init for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: "", sendLog: false }
    );

    const currentEpochData = await getCardanoCurrentEpoch();
    const maxEpoch = currentEpochData.epoch - 2;
    if (epoch >= maxEpoch) {
      throw new Error(
        `epoch ${epoch} is equal or greater than max epoch ${maxEpoch}`
      );
    }
    //const assigningEpochData = await getCardanoSpecificEpoch(epoch);
    for (const poolId of poolsId) {
      LOGGER.info(
        `[excludeSnapshotAddressesDelegatorsByEpoch][run for pool: ${JSON.stringify(
          poolId
        )}]`,
        { metadata: "", sendLog: false }
      );

      await cardanoSnapshotAddressExcludeByEpoch(poolId, epoch);

      LOGGER.info(
        `[excludeSnapshotAddressesDelegatorsByEpoch][exclude success for pool: ${JSON.stringify(
          poolId
        )}]`,
        { metadata: "", sendLog: false }
      );
    }
    LOGGER.info(
      `[excludeSnapshotAddressesDelegatorsByEpoch][Finish for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: "", sendLog: false }
    );
  } catch (error: any) {
    LOGGER.error(
      `[excludeSnapshotAddressesDelegatorsByEpoch][error for pools array: ${JSON.stringify(
        poolsId
      )}]`,
      { metadata: error }
    );
    return error;
  }
};
