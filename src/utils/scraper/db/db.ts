import { db } from "~/managers/database/databaseManager";
import { PriceAlertChecked, PriceAlertItem } from "~/types/priceAlert";


export async function addProductToAlert(product: PriceAlertItem) : Promise<{success: boolean, error: string | null}> {
	const collection = db.collection("products");
	try {
		await collection.insertOne(product);
		return {
			success: true,
			error: null,
		};
	}
	catch (e) {
		if (e instanceof Error) {
			return {
				success: false,
				error: e.message,
			};
		}
		else {
			return {
				success: false,
				error: "Unknown error",
			};
		}
	}
}

export async function updateDatabaseFromScrapeResult(product : PriceAlertChecked) : Promise<{success: boolean, error: string | null}> {
	const collection = db.collection("products");

	try {
		await collection.updateOne({ url: product.data.url }, { $set: product.data });
		return {
			success: true,
			error: null,
		};
	}
	catch (e) {
		if (e instanceof Error) {
			return {
				success: false,
				error: e.message,
			};
		}
		else {
			return {
				success: false,
				error: "Unknown error",
			};
		}
	}

}