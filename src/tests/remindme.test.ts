import { describe } from "@jest/globals";
import { parseDurationStringToMills, parseMillsToHuman } from "../utils/time/duration";

const year = 1000 * 60 * 60 * 24 * 365;
const month = 1000 * 60 * 60 * 24 * 30;
const week = 1000 * 60 * 60 * 24 * 7;
const day = 1000 * 60 * 60 * 24;
const hour = 1000 * 60 * 60;
const minute = 1000 * 60;
const second = 1000;

describe("duration string to mills", () => {
	test("parses a duration string to milliseconds", () => {
		expect(parseDurationStringToMills("1s")).toEqual({ data: 1000, success: true });
		expect(parseDurationStringToMills("1m")).toEqual({ data: 1000 * 60, success: true });
		expect(parseDurationStringToMills("1h")).toEqual({ data: 1000 * 60 * 60, success: true });
		expect(parseDurationStringToMills("1d")).toEqual({ data: 1000 * 60 * 60 * 24, success: true });
		expect(parseDurationStringToMills("1w")).toEqual({ data: 1000 * 60 * 60 * 24 * 7, success: true });
		expect(parseDurationStringToMills("1mo")).toEqual({ data: 1000 * 60 * 60 * 24 * 30, success: true });
		expect(parseDurationStringToMills("1y")).toEqual({ data: 1000 * 60 * 60 * 24 * 365, success: true });
	});


	test("parses a duration string with multiple units to milliseconds", () => {
		expect(parseDurationStringToMills("1s1m1h1d1w1mo1y")).toEqual({ data: year + month + week + day + hour + minute + second, success: true });
	});

	test("5hours 30minutes 10seconds", () => {
		expect(parseDurationStringToMills("5h30m10s")).toEqual({ data: 5 * hour + 30 * minute + 10 * second, success: true });
	});

	test("3 weeks 2 days 5 hours 10 minutes 20 seconds", () => {
		expect(parseDurationStringToMills("3w2d5h10m20s")).toEqual({ data: 3 * week + 2 * day + 5 * hour + 10 * minute + 20 * second, success: true });
	});

	test("5 years and 3 months", () => {
		expect(parseDurationStringToMills("5y3mo")).toEqual({ data: 5 * year + 3 * month, success: true });
	});

	test("returns an error when an invalid unit is given", () => {
		expect(parseDurationStringToMills("1z")).toEqual({ data: null, error: "Invalid unit z", success: false });
	});

	test("returns an error when an invalid duration is given", () => {
		expect(parseDurationStringToMills("1")).toEqual({ data: null, error: "Invalid duration", success: false });
	});

});

describe("mills to human", () => {
	test("parses milliseconds to human readable format", () => {
		expect(parseMillsToHuman(second)).toEqual("1 second ");
		expect(parseMillsToHuman(minute)).toEqual("1 minute ");
		expect(parseMillsToHuman(hour)).toEqual("1 hour ");
		expect(parseMillsToHuman(day)).toEqual("1 day ");
		expect(parseMillsToHuman(week)).toEqual("1 week ");
		expect(parseMillsToHuman(month)).toEqual("1 month ");
		expect(parseMillsToHuman(year)).toEqual("1 year ");

		expect(parseMillsToHuman(5 * hour + 30 * minute + 10 * second)).toEqual("5 hours 30 minutes 10 seconds ");
		expect(parseMillsToHuman(3 * week + 2 * day + 5 * hour + 10 * minute + 20 * second)).toEqual("3 weeks 2 days 5 hours 10 minutes 20 seconds ");
		expect(parseMillsToHuman(5 * year + 3 * month)).toEqual("5 years 3 months ");

		expect(parseMillsToHuman(5 * hour + 10 * second)).toEqual("5 hours 10 seconds ");
		expect(parseMillsToHuman(2 * day + minute)).toEqual("2 days 1 minute ");
	});
});