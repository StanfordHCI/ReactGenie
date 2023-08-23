import { HelperClass } from "reactgenie-dsl";
import "reflect-metadata";
export declare class DateTime extends HelperClass {
    year: number;
    month: number;
    day: number;
    dayOfWeek: string;
    hour: number;
    minute: number;
    second: number;
    static sunday: number;
    static monday: number;
    static tuesday: number;
    static wednesday: number;
    static thursday: number;
    static friday: number;
    static saturday: number;
    constructor({ year, month, day, hour, minute, second, }: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        second?: number;
    });
    static setup(): void;
    static compare(a: DateTime, b: DateTime): number;
    static fromString(data: string): DateTime;
    static today(): DateTime;
    CreateDatetime({ year, month, day, hour, minute, }: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
    }): DateTime;
    addDateOffset({ year, month, day, hour, minute, second, }: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        second?: number;
    }): DateTime;
    getDate(): Date;
    toString(): string;
    static Examples: {
        user_utterance: string;
        example_parsed: string;
    }[];
}
