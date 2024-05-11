import mongoose from "mongoose";
import { logger } from "~/logger/logger";

export async function connectDatabase(connectionString: string) {
	mongoose.connect(connectionString, {}).then(() => {
		logger("Connected to DB!");
	})
		.catch((err) => {
			if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") {
				logger(err);
				logger("DB connection failed. Aborting...");
				process.exit(1);
			}
		});
}