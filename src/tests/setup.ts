import { connectDatabase, disconnectDatabase } from "@managers/databaseManager";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

beforeAll(async () => {
	mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();
	await connectDatabase((uri) as string);
});

afterAll(async () => {
	await disconnectDatabase();
	await mongod.stop();
});