import {
  GenieClass,
  HelperClass,
  GenieProperty,
  GenieFunction,
} from "reactgenie-dsl";
import "reflect-metadata";
import { int } from "reactgenie-dsl";

@GenieClass("Representing a date or time")
export class DateTime extends HelperClass {
  private _date: Date;

  @GenieProperty()
  public year: int;
  @GenieProperty("month of the year, january is 1")
  public month: int;
  @GenieProperty()
  public day: int;
  @GenieProperty()
  public dayOfWeek: int;
  @GenieProperty()
  public hour: int;
  @GenieProperty()
  public minute: int;
  @GenieProperty()
  public second: int;
  // public date;

  @GenieProperty()
  static sunday: int = 0;
  @GenieProperty()
  static monday: int = 1;
  @GenieProperty()
  static tuesday: int = 2;
  @GenieProperty()
  static wednesday: int = 3;
  @GenieProperty()
  static thursday: int = 4;
  @GenieProperty()
  static friday: int = 5;
  @GenieProperty()
  static saturday: int = 6;

  private updateDate() {
    this.year = this._date.getFullYear();
    this.month = this._date.getMonth() + 1;
    this.day = this._date.getDate();
    this.hour = this._date.getHours();
    this.minute = this._date.getMinutes();
    this.dayOfWeek = this._date.getDay();
  }

  @GenieFunction("Get the current date time")
  static now(): DateTime {
    return DateTime.fromDate(new Date());
  }

  @GenieFunction("Get the current date (set hour, minute, second to 0)")
  static today(): DateTime {
    const dt = DateTime.now();
    dt.setDate({ hour: 0, minute: 0, second: 0 });
    return dt;
  }

  static fromDate(date: Date) {
    const dt = DateTime.CreateObject({});
    dt._date = date;
    dt.updateDate();
    return dt;
  }

  constructor({
    year = undefined,
    month = undefined,
    day = undefined,
    hour = undefined,
    minute = undefined,
    second = undefined,
  }: {
    year?: int;
    month?: int;
    day?: int;
    hour?: int;
    minute?: int;
    second?: int;
  }) {
    super({});
    this._date = new Date();
    this.setDate({ year, month, day, hour, minute, second });
  }

  static setup() {}

  // custom comparator for sorting
  static compare(a: DateTime, b: DateTime) {
    return a._date.getTime() - b._date.getTime();
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
    dt.month = date.getMonth() + 1;
    dt.day = date.getDate();
    dt.hour = date.getHours();
    dt.minute = date.getMinutes();
    dt.second = date.getSeconds();
    dt.dayOfWeek = date.getDay();
    return dt;
  }

  @GenieFunction("Create a new date time object")
  static CreateDatetime({
    year,
    month,
    day,
    hour,
    minute,
    second,
  }: {
    year?: int;
    month?: int;
    day?: int;
    hour?: int;
    minute?: int;
    second?: int;
  }): DateTime {
    return DateTime.CreateObject({ year, month, day, hour, minute, second });
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
    year?: int;
    month?: int;
    day?: int;
    hour?: int;
    minute?: int;
    second?: int;
  }): DateTime {
    this._date.setFullYear(this._date.getFullYear() + year);
    this._date.setMonth(this._date.getMonth() + month);
    this._date.setDate(this._date.getDate() + day);
    this._date.setHours(this._date.getHours() + hour);
    this._date.setMinutes(this._date.getMinutes() + minute);
    this._date.setSeconds(this._date.getSeconds() + second);
    this.updateDate();
    return this;
  }

  @GenieFunction("Set the date of the date time object")
  setDate({
    year,
    month,
    day,
    hour,
    minute,
    second,
    day_of_the_week,
  }: {
    year?: int;
    month?: int;
    day?: int;
    hour?: int;
    minute?: int;
    second?: int;
    day_of_the_week?: int;
  }): DateTime {
    if (year !== undefined) {
      this._date.setFullYear(year);
    }
    if (month !== undefined) {
      this._date.setMonth(month - 1);
    }
    if (day !== undefined) {
      this._date.setDate(day);
    }
    if (day_of_the_week !== undefined) {
      this._date.setDate(
        this._date.getDate() + (day_of_the_week - this._date.getDay()),
      );
    }
    if (hour !== undefined) {
      this._date.setHours(hour);
    }
    if (minute !== undefined) {
      this._date.setMinutes(minute);
    }
    if (second !== undefined) {
      this._date.setSeconds(second);
    }
    this.updateDate();
    return this;
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  getDate(): Date {
    return this._date;
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
    {
      user_utterance: "this monday",
      example_parsed:
        "DateTime.today().setDate(day_of_the_week: DateTime.monday)",
    },
    {
      user_utterance: "5 minutes later",
      example_parsed: "DateTime.now().addDateOffset(minute: 5)",
    },
  ];
}
