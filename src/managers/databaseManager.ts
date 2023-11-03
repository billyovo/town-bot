import { MongoClient } from "mongodb";

export const client : MongoClient = new MongoClient(process.env.DB_CONNECTION_STRING as string);

client.connect().then(() => {
	console.log("Connected to DB!");
})
	.catch((err) => {
		console.log(err);
		console.log("DB connection failed. Aborting...");
		process.exit(1);
	});
