import { describe, expect, test } from "@jest/globals";
import { PriceOutput } from "../@types/priceAlert";
import { parseHktvmallPrice } from "@utils/scraper/websites/hktvmall";

describe("scrape", () => {
	test("should scrape", async () => {
		const result : PriceOutput | null = await parseHktvmallPrice("https://www.hktvmall.com/hktv/zh/main/Johnson-%26-Johnson/s/H0526001/%E8%AD%B7%E7%90%86%E4%BF%9D%E5%81%A5/%E8%AD%B7%E7%90%86%E4%BF%9D%E5%81%A5/%E5%80%8B%E4%BA%BA%E8%AD%B7%E7%90%86%E7%94%A8%E5%93%81/%E8%BA%AB%E9%AB%94%E8%AD%B7%E7%90%86/%E6%B2%90%E6%B5%B4%E9%9C%B2/%E5%84%AA%E6%83%A0%E5%AD%96%E8%A3%9D-Skin-Relief%E5%A4%A9%E7%84%B6%E7%87%95%E9%BA%A5%E9%AB%98%E6%95%88%E8%88%92%E7%B7%A9%E6%B2%90%E6%B5%B4%E9%9C%B21%E5%85%AC%E5%8D%87-%E5%8E%9F%E8%A3%9D%E8%A1%8C%E8%B2%A8-%E6%A5%B5%E4%B9%BE%E5%8F%8A%E6%95%8F%E6%84%9F%E8%82%8C%E8%86%9A-%E8%88%92%E7%B7%A9%E7%9A%AE%E8%86%9A%E6%95%8F%E6%84%9F-%E7%9A%AE%E8%86%9A%E7%97%95%E7%99%A2%E6%B3%9B%E7%B4%85%E4%B9%BE%E7%87%A5-%E6%BA%AB%E5%92%8C%E6%BD%94%E8%86%9A-%E4%B8%89%E9%87%8D%E7%87%95%E9%BA%A5%E7%B2%BE%E8%8F%AF%E7%87%95%E9%BA%A5%E8%86%A0-%E7%87%95%E9%BA%A5%E6%B2%B9-%E7%87%95%E9%BA%A5%E7%B2%BE%E7%B2%B9-70%E5%B9%B4%E7%87%95%E9%BA%A5%E6%B4%BB%E8%90%83%E7%A7%91%E7%A0%94-%E7%BE%8E%E5%9C%8B%E7%9A%AE%E8%86%9A%E7%A7%91%E9%86%AB%E7%94%9F%E6%8E%A8%E8%96%A6/p/H0888001_S_10040260A");
		expect(result).toEqual({
			price: expect.any(Number),
			productName: expect.any(String),
			brand: expect.any(String),
		});
		console.log(result);
	});
});