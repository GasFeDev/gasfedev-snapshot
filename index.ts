import express, { Request, Response } from "express";
import { excludeSnapshotAddressesDelegators, excludeSnapshotAddressesDelegatorsByEpoch, executeSnapshotCardano } from "./src/getData";
import { connectDb } from "./mongodb";
import dotenv from "dotenv";
import { LOGGER } from "./logger";
import { getCardanoCurrentEpoch } from "./src/helpers/cardanoHelpers";


dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.APP_PORT || 3030;

const cardanoPoolsId = process.env.POOL_ID?.split(",") || [""];

// snapshot cardano specific endpoint
app.get("/execute/cardanoSnapshot", async (req: Request, res: Response) => {
  try {
    LOGGER.info(`[execute/cardanoSnapshot][enter service start snapshot]`, {
      metadata: "", sendLog: false
    });

    const currentEpochData = await getCardanoCurrentEpoch();
    const assigningEpoch = currentEpochData.epoch - 1;

    executeSnapshotCardano(
      cardanoPoolsId,
      assigningEpoch
    );

    LOGGER.info(`[execute/cardanoSnapshot][snapshot completed]`, {
      metadata: "", sendLog: false
    });

    res.send("Cardano snapshot successfully.");
  } catch (error: any) {
    LOGGER.error(`[execute/cardanoSnapshot][error in service]`, {
      metadata: { error: error, stack: error.stack.toString() },
    });
    res.status(500).send("Error snapshot.");
  }
});

// snapshot exclude cardano specific endpoint
app.get("/exclude/cardanoSnapshot", async (req: Request, res: Response) => {
  try {
    LOGGER.info(`[exclude/cardanoSnapshot][enter service start snapshot exclude]`, {
      metadata: "", sendLog: true
    });

    const currentEpochData = await getCardanoCurrentEpoch();

    await excludeSnapshotAddressesDelegators(
      cardanoPoolsId,
      currentEpochData.epoch
    );

    LOGGER.info(`[exclude/cardanoSnapshot][snapshot exclude completed]`, {
      metadata: "", sendLog: true
    });

    res.send("Cardano snapshot exclude successfully.");
  } catch (error) {
    LOGGER.error(`[exclude/cardanoSnapshot][error in service exclude]`, {
      metadata: error,
    });
    res.status(500).send("Error snapshot exclude.");
  }
});

try {
  app.listen(port, async () => {
    await connectDb();
    LOGGER.info(`[appStart][Connected successfully on port: ${port}]`, { metadata: "", sendLog: true });
  });
} catch (err) {
  console.error(`Error: ${err}`);
}

app.post("/exclude/cardanosnapshot/", async (req: Request, res: Response) => {
  try {
    LOGGER.info(`[exclude/cardano][enter service]`, { metadata: "", sendLog: true });

    const epochString = req.body.epoch;

    if (!epochString) {
      throw new Error("Epoch is required")
    };

    const epoch = Number(epochString);

    await excludeSnapshotAddressesDelegatorsByEpoch(epoch, cardanoPoolsId);

    res.send(`Cardano exclude delegators Addresses successfully for epoch ${epoch}.`);

  } catch (error) {

    LOGGER.error(`[exclude/cardano][error in service]`, { metadata: error });
    res.status(500).send("Error exclude delegators Addresses.");
  }
});
