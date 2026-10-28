import { describe, expect, test } from "vitest";
import { parseShopWebsite } from "~/src/lib/price-alert/scrape/parse";
import { PriceAlertShopOption } from "~/src/lib/price-alert/utils/enums/priceAlertShopOption";

// hits the real sites, replace a url when its product is removed
const products: { shop: PriceAlertShopOption; url: string }[] = [
	{ shop: PriceAlertShopOption.HKTVMALL, url: "https://www.hktvmall.com/p/H5096004_S_FF-061661" },
	{ shop: PriceAlertShopOption.WATSONS, url: "https://www.watsons.com.hk/zh-hk/p/BP_209640" },
	{ shop: PriceAlertShopOption.PNS, url: "https://www.pns.hk/en/golden-pastry/p/BP_463834" },
	{ shop: PriceAlertShopOption.AEONCITY, url: "https://www.aeoncity.com.hk/kh_zh/030787170.html" },
	{
		shop: PriceAlertShopOption.SEPHORA,
		url: "https://www.sephora.hk/products/k18-biomimetic-hairscience-leave-in-molecular-repair-hair-mask/v/50ml",
	},
	{
		shop: PriceAlertShopOption.MANNINGS,
		url: "https://www.mannings.com.hk/zh-hant/suzuran-baby-dry-cleaning-cotton-140pcs/p/326389",
	},
	{ shop: PriceAlertShopOption.SHOPLINE, url: "https://www.onkee.com/products/3837" },
	{
		shop: PriceAlertShopOption.WELLCOME,
		url: "https://www.wellcome.com.hk/zh-hant/wellcome/p/MEADOWS%20%E7%BE%8E%E5%9C%8B%E6%80%A5%E5%87%8D%E7%A9%80%E9%A3%BC%E7%89%9B%E8%82%8B%E8%82%89%E6%A2%9D%20454GM/i/101364300.html",
	},
	{
		shop: PriceAlertShopOption.STYLEVANA,
		url: "https://www.stylevana.com/en_US/mediheal-the-n-m-f-ampoule-mask-original-10pcs19031.html",
	},
];

describe("price alert scraping", () => {
	test.each(products)("$shop", async ({ shop, url }) => {
		const result = await parseShopWebsite(url, null, { skipImageFetch: true });

		expect(result.error).toBeFalsy();
		expect(result.data?.shop).toBe(shop);
		expect(result.data?.productName).toBeTruthy();
		expect(result.data?.price).toBeGreaterThan(0);
	});
});
