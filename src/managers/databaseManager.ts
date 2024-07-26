import mongoose from "mongoose";
import { logger } from "~/src/lib/logger/logger";

export async function connectDatabase(connectionString: string) {
	mongoose.connect(connectionString, {}).then(() => {
		logger.info("Connected to DB!");
	})
		.catch((err) => {
			if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") {
				logger.error(err);
				logger.error("DB connection failed. Aborting...");
				process.exit(1);
			}
		});
}