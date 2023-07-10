import { LOGGER } from "../../logger";
import {
  CardanoExclude,
  CardanoExcludeDoc,
} from "../schemas/prereleaseCardano";

export const createCardanoSnapshotExclude = async (
  data: CardanoExcludeDoc
): Promise<CardanoExcludeDoc | null> => {
  try {
    const snapshotExclude = CardanoExclude.create(data);
    return snapshotExclude;
  } catch (error) {
    LOGGER.error(`[createCardanoExclude][Error]`, { metadata: error });
    return null;
  }
};

// Get all addresses to exclude from snapshot
export const getAllCardanoPrerelease = async (): Promise<
  CardanoExcludeDoc[]
> => {
  try {
    const addressesExcluded = await CardanoExclude.find();
    return addressesExcluded;
  } catch (error: any) {
    LOGGER.error(`[getAllCardanoPrerelease][Error]`, { metadata: error });
    return [];
  }
};