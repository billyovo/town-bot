import { MongoClient } from "mongodb";
import { logger } from "../logger/logger";

const client : MongoClient = new MongoClient(process.env.DB_CONNECTION_STRING as string);

client.connect().then(() => {
	logger("Connected to DB!");
})
	.catch((err) => {
		if (process.env.NODE_ENV !== "development") {
			logger(err);
			logger("DB connection failed. Aborting...");
			process.exit(1);
		}
	});

const db = client.db("admin_minigames");
export const winnerCollection = db.collection("winner");