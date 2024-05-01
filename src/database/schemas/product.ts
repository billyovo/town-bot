import { PriceAlertShopOption } from "~/enums/priceAlertShopOption";
import { Schema, model } from "mongoose";

export interface PriceAlertItem {
    lastChecked: Date,
    url: string,
    price: number,
    brand: string,
    productName: string,
    productImage: string | null,
    shop: PriceAlertShopOption,
    failCount: number,
    previous?: {
        price: number,
        date: Date,
    },
}

const priceAlertSchema = new Schema<PriceAlertItem>({
	lastChecked: Date,
	url: String,
	price: Number,
	brand: String,
	productName: String,
	productImage: String,
	shop: String,
	failCount: Number,
	previous: {
		price: Number,
		date: Date,
	},
});

export const PriceAlertModel = model<PriceAlertItem>("products", priceAlertSchema);