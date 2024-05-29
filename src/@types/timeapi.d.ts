export type TimeAPIData = {
	fromTimezone: string,
	fromDateTime: string,
	toTimeZone: string,
	conversionResult: {
		year: number,
		month: numbe,
		day: number,
		hour: numbe,
		minute: number,
		seconds: number,
		milliSeconds: number,
		dateTime: string,
		date: string,
		time: string,
		timeZone: string,
		dstActive: boolean,
	},
}
