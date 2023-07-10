import dotenv from "dotenv";
import { getStakeDistributionByPool } from "./helpers/snapshotCardanoHelpers";
import { LOGGER } from "../logger";
import { createCardanoSnapshotExclude } from "../mongodb/operations/prereleaseCardano";
import {
  CardanoExclude,
  CardanoExcludeDoc,
} from "../mongodb/schemas/prereleaseCardano";

dotenv.config();

export const cardanoSnapshotAddressExclude = async (
  poolId: string,
  assigningEpochData: number
) => {
  try {
    const delegatorsResponse = await getStakeDistributionByPool(
      assigningEpochData,
      poolId
    );

    for (const delegator of delegatorsResponse) {
      const delegatorAddress = delegator.stakeAddress;

      const newSnapshot: CardanoExcludeDoc = new CardanoExclude({
        epoch: assigningEpochData,
        address: delegatorAddress,
        pool: poolId,
      });
      await createCardanoSnapshotExclude(newSnapshot);
    }

    LOGGER.error(`[cardanoSnapshotAddressExclude][Completed]`, { metadata: {} });
  } catch (error) {
    console.error(error);
    LOGGER.error(`[cardanoSnapshotAddressExclude][Error]`, { metadata: error });
  }
};

export const cardanoSnapshotAddressExcludeByEpoch = async (
    poolId: string,
    assigningEpochData: number
  ) => {
    try {
      const delegatorsResponse = await getStakeDistributionByPool(
        assigningEpochData,
        poolId
      );
  
      for (const delegator of delegatorsResponse) {
        const delegatorAddress = delegator.stakeAddress;
  
        const newSnapshot: CardanoExcludeDoc = new CardanoExclude({
          epoch: assigningEpochData,
          address: delegatorAddress,
          pool: poolId,
        });
        await createCardanoSnapshotExclude(newSnapshot);
      }
  
      LOGGER.error(`[cardanoSnapshotAddressExcludeByEpoch][Completed]`, { metadata: {} });
    } catch (error) {
      console.error(error);
      LOGGER.error(`[cardanoSnapshotAddressExcludeByEpoch][Error]`, { metadata: error });
    }
  };