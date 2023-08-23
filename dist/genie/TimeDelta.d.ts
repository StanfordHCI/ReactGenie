import { HelperClass } from "reactgenie-dsl";
import "reflect-metadata";
export declare class TimeDelta extends HelperClass {
    hour: number;
    minute: number;
    second: number;
    constructor({ hour, minute, second, }: {
        hour?: number;
        minute?: number;
        second?: number;
    });
    static setup(): void;
    static compare(a: TimeDelta, b: TimeDelta): number;
    static CreateTimeDelta({ hour, minute, second, }: {
        hour?: number;
        minute?: number;
        second?: number;
    }): TimeDelta;
    addOffset({ hour, minute, second, }: {
        hour?: number;
        minute?: number;
        second?: number;
    }): void;
    setTime({ hour, minute, second, }: {
        hour?: number;
        minute?: number;
        second?: number;
    }): void;
    getLeftSecond(): number;
    toString(): string;
    static Examples: {
        user_utterance: string;
        example_parsed: string;
    }[];
}
