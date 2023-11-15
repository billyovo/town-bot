import { describe, expect, test } from "@jest/globals";
import { EventData } from "../../@types/eventSchedule";
import { generateSchedule } from "@utils/eventScheduleGenerator/eventScheduleGenerator";


describe("Event Schedule Generator", () => {
	test("should generate a valid schedule", () => {
		const testSchedule : EventData[] = [
			{
				id: "test",
				title: "Test",
				rrule: "RRULE:FREQ=DAILY;INTERVAL=1",
				emote: "🤖",
			},
		];
		const schedule = generateSchedule(new Date(2023, 10, 6), testSchedule);
		expect(schedule.list.size).toBe(1);
		expect(schedule.today.size).toBe(1);
		expect(schedule.tomorrow.size).toBe(0);
	});

	test("should generate a valid schedule with multiple events", () => {
		const testSchedule : EventData[] = [
			{
				id: "test",
				title: "Test",
				rrule: "RRULE:FREQ=DAILY;INTERVAL=1",
				emote: "🤖",
			},
			{
				id: "test2",
				title: "Test2",
				rrule: "RRULE:FREQ=DAILY;INTERVAL=1",
				emote: "🤖",
			},
		];
		const schedule = generateSchedule(new Date(2023, 10, 6), testSchedule);
		expect(schedule.list.size).toBe(2);
		expect(schedule.today.size).toBe(2);
		expect(schedule.tomorrow.size).toBe(0);
	});

	test("should handle byday events", () => {
		const testSchedule : EventData[] = [
			{
				"title": "七彩羊駝保衛戰",
				"id": "boat",
				"rrule": "FREQ=MONTHLY;BYDAY=4WE,2SA;TZID=Asia/Taipei;BYHOUR=21;BYMINUTE=0;BYSECOND=0",
				"emote": "🦙",
			},
		];
		const schedule = generateSchedule(new Date(2023, 10, 6), testSchedule);
		expect(schedule.list.size).toBe(1);
		expect(schedule.today.size).toBe(0);
		expect(schedule.tomorrow.size).toBe(0);
	});

	test("should handle byday events with today", () => {
		const testSchedule : EventData[] = [
			{
				"title": "高空墜落",
				"id": "drop",
				"rrule": "FREQ=MONTHLY;BYDAY=1MO,3FR;TZID=Asia/Taipei;BYHOUR=21;BYMINUTE=0;BYSECOND=0",
				"emote": "🪂",
			},
		];
		const schedule = generateSchedule(new Date(2023, 10, 6), testSchedule);
		expect(schedule.list.size).toBe(1);
		expect(schedule.today.size).toBe(1);
		expect(schedule.tomorrow.size).toBe(0);
	});

	test("should handle multiple byday events", () => {
		const testSchedule : EventData[] = [
			{
				"title": "test",
				"id": "test",
				"rrule": "FREQ=MONTHLY;BYDAY=1MO;TZID=Asia/Taipei;BYHOUR=21;BYMINUTE=0;BYSECOND=0",
				"emote": "🪂",
			},
			{
				"title": "test2",
				"id": "test2",
				"rrule": "FREQ=MONTHLY;BYDAY=1TU;TZID=Asia/Taipei;BYHOUR=21;BYMINUTE=0;BYSECOND=0",
				"emote": "🪂",
			},
		];
		const schedule = generateSchedule(new Date(2023, 10, 6), testSchedule);
		expect(schedule.list.size).toBe(2);
		expect(schedule.today.size).toBe(1);
		expect(schedule.tomorrow.size).toBe(1);
	});

	test("should only calculate nearest event occurence", () => {
		const testSchedule : EventData[] = [
			{
				"title": "test",
				"id": "test",
				"rrule": "FREQ=MONTHLY;BYDAY=1MO;TZID=Asia/Taipei;BYHOUR=21;BYMINUTE=0;BYSECOND=0",
				"emote": "🪂",
			},
			// should ignore 2TU, since 1MO is closer
			{
				"title": "test2",
				"id": "test2",
				"rrule": "FREQ=MONTHLY;BYDAY=1MO,1TU;TZID=Asia/Taipei;BYHOUR=21;BYMINUTE=0;BYSECOND=0",
				"emote": "🪂",
			},
		];
		const schedule = generateSchedule(new Date(2023, 10, 6), testSchedule);
		expect(schedule.list.size).toBe(2);
		expect(schedule.today.size).toBe(2);
		expect(schedule.tomorrow.size).toBe(0);
	});
});