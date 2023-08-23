import {
  GenieClass,
  HelperClass,
  GenieProperty,
  GenieFunction,
} from "reactgenie-dsl";
import "reflect-metadata";

@GenieClass("Representing a date or time")
export class DateTime extends HelperClass {
  @GenieProperty()
  public year: number;
  @GenieProperty()
  public month: number;
  @GenieProperty()
  public day: number;
  @GenieProperty()
  public dayOfWeek: string;
  @GenieProperty()
  public hour: number;
  @GenieProperty()
  public minute: number;
  @GenieProperty()
  public second: number;
  // public date;

  static sunday = 0;
  static monday = 1;
  static tuesday = 2;
  static wednesday = 3;
  static thursday = 4;
  static friday = 5;
  static saturday = 6;

  constructor({
    year = undefined,
    month = undefined,
    day = undefined,
    hour = undefined,
    minute = undefined,
    second = undefined,
  }: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
  }) {
    super({});
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.dayOfWeek = "";
    // this.setDate({year, month, day, hour, minute});
  }

  static setup() {}

  // custom comparator for sorting
  static compare(a: DateTime, b: DateTime) {
    return a.getDate().getTime() - b.getDate().getTime();
  }

  static fromString(data: string) {
    let date: Date;
    // const dt = DateTime.CreateObject({});
    const dt = DateTime.CreateObject({});
    if (data == "today") date = new Date();
    else if (data == "yesterday") {
      date = new Date();
      date.setDate(date.getDate() - 1);
    } else if (data == "beforeYesterday") {
      date = new Date();
      date.setDate(date.getDate() - 1);
    } else date = new Date(data);
    dt.year = date.getFullYear();
    dt.month = date.getMonth();
    dt.day = date.getDate();
    dt.hour = date.getHours();
    dt.minute = date.getMinutes();
    dt.second = date.getSeconds();
    dt.dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    return dt;
  }

  @GenieFunction("Get the current date time")
  static today(): DateTime {
    return DateTime.fromString("today");
  }

  @GenieFunction("Create a new date time object")
  CreateDatetime({
    year = undefined,
    month = undefined,
    day = undefined,
    hour = undefined,
    minute = undefined,
  }: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
  }): DateTime {
    return DateTime.CreateObject({ year, month, day, hour, minute });
  }

  @GenieFunction("Add a date offset to the current date")
  addDateOffset({
    year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
    second = 0,
  }: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
  }): DateTime {
    this.year = this.year + year;
    this.month = this.month + month;
    this.day = this.day + day;
    this.hour = this.hour + hour;
    this.minute = this.minute + minute;
    this.second = this.second + second;
    return this;
  }

  @GenieFunction("Get the date of the DateTime object")
  getDate(): Date {
    const date = new Date();
    date.setFullYear(this.year);
    date.setMonth(this.month);
    date.setDate(this.day);
    date.setHours(this.hour);
    date.setMinutes(this.minute);
    date.setSeconds(this.second);
    return date;
  }

  // @GenieFunction("Set the date of the date time object")

  toString() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  static Examples = [
    {
      user_utterance: "yesterday",
      example_parsed: "DateTime.today().addDateOffset(day: -1)",
    },
    {
      user_utterance: "tomorrow",
      example_parsed: "DateTime.today().addDateOffset(day: 1)",
    },
    {
      user_utterance: "next week",
      example_parsed: "DateTime.today().addDateOffset(day: 7)",
    },
  ];
}
