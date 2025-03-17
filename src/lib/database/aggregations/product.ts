import { PipelineStage } from "mongoose";

export const groupProductByNameAndBrand : PipelineStage[] = [
	{
		"$group": {
			"_id": {
				"productName": "$productName",
				"brand": "$brand",
			},
			"shops": {
				"$push": {
					"price": "$price",
					"productImage": "$productImage",
					"shop": "$shop",
					"lastChecked": "$lastChecked",
					"quantity": "$quantity",
					"url": "$url",
					"promotions": {
						"$filter": {
							"input": "$promotions",
							"as": "promotion",
							"cond": {
								"$eq": [
									"$$promotion.type", "DISCOUNT",
								],
							},
						},
					},
					"previous": "$previous",
				},
			},
		},
	}, {
		"$project": {
			"_id": 0,
			"shops": {
				"$sortArray": {
					"input": "$shops",
					"sortBy": {
						"price": 1,
					},
				},
			},
			"productName": "$_id.productName",
			"brand": "$_id.brand",
		},
	},
];