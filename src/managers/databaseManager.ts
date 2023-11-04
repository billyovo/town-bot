import { MongoClient } from "mongodb";

const client : MongoClient = new MongoClient(process.env.DB_CONNECTION_STRING as string);

client.connect().then(() => {
	console.log("Connected to DB!");
})
	.catch((err) => {
		if (process.env.NODE_ENV !== "development") {
			console.log(err);
			console.log("DB connection failed. Aborting...");
			process.exit(1);
		}
	});

const db = client.db("admin_minigames");
export const winnerCollection = db.collection("winner");