export function parsePriceToFloat(price: string) : number {
	return parseFloat(price.replace(/[^0-9.]/g, ""));
}

export function formatBrandName(brand: string) : string {
	if (!brand) return "";
	const lowerBrand = brand.toLowerCase();
	const brandWords = lowerBrand.split(" ");
	return brandWords.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}