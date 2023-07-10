import { LOGGER } from "../../logger";
import {
  CardanoPartnerPolicy,
  CardanoPolicyDoc,
} from "../schemas/snapshotPolicy";

// Create a new CardanoPolicy document
export const createCardanoPolicy = async (
  name: string,
  value: string
): Promise<CardanoPolicyDoc | null> => {
  try {
    const newPolicy = new CardanoPartnerPolicy({ name, value });
    const createdPolicy = await newPolicy.save();
    return createdPolicy;
  } catch (error: any) {
    LOGGER.error(`[createCardanoPolicy][Error]`, { metadata: { error: error, stack: error.stack.toString() }  });
    return null;
  }
};

// Get all CardanoPolicy documents
export const getAllCardanoPolicies = async (): Promise<
  CardanoPolicyDoc[] | null
> => {
  try {
    const policies = await CardanoPartnerPolicy.find();
    return policies;
  } catch (error: any) {
    LOGGER.error(`[getAllCardanoPolicies][Error]`, { metadata: { error: error, stack: error.stack.toString() }  });
    return null;
  }
};

// Update a CardanoPolicy document
export const updateCardanoPolicy = async (
  id: string,
  name: string,
  value: string
): Promise<CardanoPolicyDoc | null> => {
  try {
    const updatedPolicy = await CardanoPartnerPolicy.findByIdAndUpdate(
      id,
      { name, value },
      { new: true }
    );
    return updatedPolicy;
  } catch (error: any) {
    LOGGER.error(`[updateCardanoPolicy][Error]`, { metadata: { error: error, stack: error.stack.toString() }  });
    return null;
  }
};

// Delete a CardanoPolicy document
export const deleteCardanoPolicy = async (
  id: string
): Promise<CardanoPolicyDoc | null> => {
  try {
    const deletedPolicy = await CardanoPartnerPolicy.findByIdAndDelete(id);
    return deletedPolicy;
  } catch (error: any) {
    LOGGER.error(`[deleteCardanoPolicy][Error]`, { metadata: { error: error, stack: error.stack.toString() }  });
    return null;
  }
};
