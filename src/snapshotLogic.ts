import dotenv from "dotenv";
import {
  getStakeDistributionByPool,
  getAssetsAssociatedWithStakeAddresses,
  UserAsset,
} from "./helpers/snapshotCardanoHelpers";
import { createCardanoSnapshot } from "./../mongodb/operations/snapshotCardano";
import {
  CardanoSnapshot,
  CardanoSnapshotDoc,
} from "../mongodb/schemas/snapshotCardano";
import { LOGGER } from "../logger";
import { getAllCardanoPolicies } from "../mongodb/operations/snapshotPolicy";
import { CardanoPolicyDoc } from "../mongodb/schemas/snapshotPolicy";

dotenv.config();

type PartnerData = {
  name: string;
  amount: number;
  bonus: boolean;
  policy: string;
}

export const cardanoSnapshot = async (
  currentBatchId: string,
  poolId: string,
  assigningEpochData: number
) => {
  try {
    const policies = await getAllCardanoPolicies();
    if (!policies) {
      LOGGER.error(`[cardanoSnapshot][No Partner Policies found]`, {
        metadata: {},
      });
      return;
    }

    LOGGER.info(`[cardanoSnapshot][Partners]`, { metadata: { policies }, sendLog: true });

    const delegatorsResponse = await getStakeDistributionByPool(
      assigningEpochData,
      poolId
    );

    // filter the desired policies with reduce
    // Type is missing here
    const partnerPolicies = policies.reduce((acc, policy) => {
      return [...acc, policy.value];
    }, [] as string[]);

    for (const delegator of delegatorsResponse) {
      const delegatorAddress = delegator.stakeAddress;

      const newSnapshot: CardanoSnapshotDoc = new CardanoSnapshot({
        batchId: currentBatchId,
        poolId: poolId,
        epoch: assigningEpochData,
        delegatorAddress: delegatorAddress,
      });

      const accountDetailsAssets =
        await getAssetsAssociatedWithStakeAddresses(delegatorAddress);

      // fix types
      const partnerPoliciesFound = accountDetailsAssets.reduce((acc, asset) => {
        const found = partnerPolicies.find((p) => p === asset.unit);
        if (found) {
          return [...acc, asset];
        }
        return acc;
      }, ([]) as UserAsset[]);

      // reformat found policies
      const partnerPoliciesFoundFormatted = partnerPoliciesFound.reduce((acc, asset) => {
        const partner = policies.find((p) => p.value === asset.unit);
        if (!partner) {
          return acc;
        }
        const minPartnerQuantity = partner.minQuantity
        const hasBonus = asset.quantity >= parseInt(minPartnerQuantity);
        const tempData: PartnerData = {
          name: partner.name,
          bonus: hasBonus,
          amount: asset.quantity,
          policy: asset.unit,
        }
        return [...acc, tempData];
      }, [] as PartnerData[]);

      newSnapshot.partnerData = JSON.stringify(partnerPoliciesFoundFormatted);
      await createCardanoSnapshot(newSnapshot);
    }

    LOGGER.info(`[cardanoSnapshot][Completed]`, { metadata: {}, sendLog: true });
  } catch (error: any) {
    console.error(error);
    LOGGER.error(`[cardanoSnapshot][Error]`, { metadata: { error: error, stack: error.stack.toString() } });
  }
};
