import {
  GenieClass,
  HelperClass,
  GenieProperty,
  GenieFunction,
} from "reactgenie-dsl";
import "reflect-metadata";

@GenieClass("Delta time")
export class TimeDelta extends HelperClass {
  @GenieProperty()
  public hour: number;
  @GenieProperty()
  public minute: number;
  @GenieProperty()
  public second: number;

  constructor({
    hour = 0,
    minute = 0,
    second = 0,
  }: {
    hour?: number;
    minute?: number;
    second?: number;
  }) {
    super({});
    this.hour = hour;
    this.minute = minute;
    this.second = second;
  }

  static setup() {}

  // custom comparator for sorting
  static compare(a: TimeDelta, b: TimeDelta) {
    console.log(a.getLeftSecond(), b.getLeftSecond());
    return a.getLeftSecond() - b.getLeftSecond();
  }

  @GenieFunction("Create a new TimeDelta object")
  static CreateTimeDelta({
    hour = 0,
    minute = 0,
    second = 0,
  }: {
    hour?: number;
    minute?: number;
    second?: number;
  }): TimeDelta {
    return TimeDelta.CreateObject({
      hour: hour,
      minute: minute,
      second: second,
    });
  }

  @GenieFunction("Add a offset to the time")
  addOffset({
    hour = 0,
    minute = 0,
    second = 0,
  }: {
    hour?: number;
    minute?: number;
    second?: number;
  }): TimeDelta {
    const offsettime =
      this.getLeftSecond() + hour * 3600 + minute * 60 + second;
    if (offsettime < 0) {
      this.hour = 0;
      this.minute = 0;
      this.second = 0;
      return this;
    }
    this.hour = Math.floor(offsettime / 3600);
    this.minute = Math.floor((offsettime % 3600) / 60);
    this.second = offsettime % 60;
    return this;
  }

  @GenieFunction("Set the value to the time")
  setTime({
    hour = 0,
    minute = 0,
    second = 0,
  }: {
    hour?: number;
    minute?: number;
    second?: number;
  }): TimeDelta {
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    return this;
  }

  @GenieFunction("Get the second of the TimeDelta object")
  getLeftSecond(): number {
    return this.second + this.minute * 60 + this.hour * 3600;
  }

  toString() {
    return `${this.hour}:${this.minute}:${this.second}`;
  }
}

export const TimeDeltaExamples = [
  {
    user_utterance: "20 miniutes later",
    example_parsed: "TimeDelta.CreateObject({minute: 20})",
  },
  {
    user_utterance: "1hour later",
    example_parsed: "TimeDelta.CreateObject({hour: 1})",
  },
  {
    user_utterance: "1hour 20miniutes later",
    example_parsed: "TimeDelta.CreateObject({hour: 1, minute: 20})",
  },
];
