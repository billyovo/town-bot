import { Collection, Db, MongoClient } from "mongodb";
import { logger } from "../logger/logger";

let client: MongoClient;
let db : Db;
let winnerCollection : Collection;

export async function connectDatabase(connectionString: string) {
	client = new MongoClient(connectionString);

	client.connect().then(() => {
		logger("Connected to DB!");
	})
		.catch((err) => {
			if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") {
				logger(err);
				logger("DB connection failed. Aborting...");
				process.exit(1);
			}
		});

	db = client.db("admin_minigames");
	winnerCollection = db.collection("winner");
}

export async function disconnectDatabase() {
	await client.close();
}

export {
	winnerCollection,
	db,
};
