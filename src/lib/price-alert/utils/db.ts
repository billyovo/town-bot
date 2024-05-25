import { PriceAlertItem, PriceAlertModel } from "~/src/lib/database/schemas/product";


export async function addProductToAlert(product: PriceAlertItem) : Promise<{success: boolean, error: string | null}> {
	try {
		await PriceAlertModel.create(product);
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