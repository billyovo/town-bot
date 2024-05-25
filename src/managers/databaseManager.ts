import mongoose from "mongoose";
import { log } from "../lib/logger/logger";

export async function connectDatabase(connectionString: string) {
	mongoose.connect(connectionString, {}).then(() => {
		log("Connected to DB!");
	})
		.catch((err) => {
			if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") {
				log(err);
				log("DB connection failed. Aborting...");
				process.exit(1);
			}
		});
}