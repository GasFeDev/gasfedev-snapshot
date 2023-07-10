import { LOGGER } from "../../logger";
import {
  CardanoSnapshot,
  CardanoSnapshotDoc,
} from "../schemas/snapshotCardano";

export const createCardanoSnapshot = async (
  data: CardanoSnapshotDoc
): Promise<CardanoSnapshotDoc | null> => {
  try {
    const snapshot = CardanoSnapshot.create(data);
    return snapshot;
  } catch (error: any) {
    LOGGER.error(`[createCardanoSnapshot][Error]`, { metadata: { error: error, stack: error.stack.toString() }  });
    return null;
  }
};

export const getCardanoSnapshotByDelegatorAddress = async (
  delegatorAddress: string
): Promise<CardanoSnapshotDoc | null> => {
  try {
    const snapshot = await CardanoSnapshot.findOne({ delegatorAddress });
    return snapshot;
  } catch (error: any) {
    LOGGER.error(`[getCardanoSnapshotByDelegatorAddress][Error]`, {
      metadata: { error: error, stack: error.stack.toString() } ,
    });
    return null;
  }
};

export { CardanoSnapshotDoc };
