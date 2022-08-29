import {GenieClass} from "reactgenie";
import {ClassDescriptor, FieldDescriptor, FuncDescriptor, GenieObject, ParamDescriptor} from "reactgenie-dsl";
import "reflect-metadata";

@GenieClass("Representing a date or time")
export class DateTime extends GenieObject {
    public date;

    public year: number;
    public month: number;
    public day: number;
    public dayOfWeek: string;
    public hour: number;
    public minute: number;

    private updateDate() {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth() + 1;
        this.day = this.date.getDate();
        this.hour = this.date.getHours();
        this.minute = this.date.getMinutes();
        this.dayOfWeek = this.date.toLocaleDateString("en-US", { weekday: "long" });
    }

    static setup() {

    }

    static today() {
        return DateTime.fromDate(new Date());
    }

    static sunday = 0
    static monday = 1
    static tuesday = 2
    static wednesday = 3
    static thursday = 4
    static friday = 5
    static saturday = 6

    static fromDate(date: Date) {
        const dt = new DateTime({});
        dt.date = date;
        dt.updateDate();
        return dt;
    }

    // custom comparator for sorting

    static compare(a: DateTime, b: DateTime) {
        return a.date.getTime() - b.date.getTime();
    }

    constructor({year = undefined, month = undefined, day = undefined, hour = undefined, minute = undefined}: { year?: number, month?: number, day?: number, hour?: number, minute?: number }) {
        super({year, month, day, hour, minute});
        this.date = new Date();
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.dayOfWeek = "";
        this.setDate({year, month, day, hour, minute});
    }

    addDateOffset({year = 0, month = 0, day = 0, hour = 0, minute = 0}: { year: number, month: number, day: number, hour: number, minute: number }) {
        this.date.setFullYear(this.date.getFullYear() + year);
        this.date.setMonth(this.date.getMonth() + month);
        this.date.setDate(this.date.getDate() + day);
        this.date.setHours(this.date.getHours() + hour);
        this.date.setMinutes(this.date.getMinutes() + minute);
        this.updateDate();
        return this;
    }

    setDate({year = undefined, month = undefined, day = undefined, hour = undefined, minute = undefined, day_of_the_week = undefined}: { year?: number, month?: number, day?: number, hour?: number, minute?: number, day_of_the_week?: number }) {
        if (year !== undefined) {
            this.date.setFullYear(year);
        }
        if (month !== undefined) {
            this.date.setMonth(month - 1);
        }
        if (day !== undefined) {
            this.date.setDate(day);
        }
        if (day_of_the_week !== undefined) {
            this.date.setDate(this.date.getDate() + (day_of_the_week - this.date.getDay()));
        }
        if (hour !== undefined) {
            this.date.setHours(hour);
        }
        if (minute !== undefined) {
            this.date.setMinutes(minute);
        }
        this.updateDate();
        return this;
    }


    toString() {
        return `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}`;
    }

    static ClassDescriptor = new ClassDescriptor<DateTime>(
        "DateTime",
        [
            new FuncDescriptor("addDateOffset", [
                    new ParamDescriptor("year", "int"),
                    new ParamDescriptor("month", "int"),
                    new ParamDescriptor("day", "int"),
                    new ParamDescriptor("hour", "int"),
                    new ParamDescriptor("minute", "int")],
                "DateTime", false,
                "Add a date offset to the current date"),
            new FuncDescriptor("constructor", [
                    new ParamDescriptor("year", "int", false),
                    new ParamDescriptor("month", "int", false),
                    new ParamDescriptor("day", "int", false),
                    new ParamDescriptor("hour", "int", false),
                    new ParamDescriptor("minute", "int", false)
                ], "DateTime", false,
                "Create a new date time object"),
            new FuncDescriptor("setDate", [
                    new ParamDescriptor("year", "int", false),
                    new ParamDescriptor("month", "int", false),
                    new ParamDescriptor("day", "int", false),
                    new ParamDescriptor("hour", "int", false),
                    new ParamDescriptor("minute", "int", false),
                    new ParamDescriptor("day_of_the_week", "int", false)
                ], "DateTime", false,
                "Set the date of the date time object"),
            new FuncDescriptor("today", [], "DateTime", true,
                "Get the current date time")
        ],
        [
            new FieldDescriptor("year", "int", false),
            new FieldDescriptor("month", "int", false),
            new FieldDescriptor("day", "int", false),
            new FieldDescriptor("hour", "int", false),
            new FieldDescriptor("minute", "int", false),
            new FieldDescriptor("sunday", "int", true),
            new FieldDescriptor("monday", "int", true),
            new FieldDescriptor("tuesday", "int", true),
            new FieldDescriptor("wednesday", "int", true),
            new FieldDescriptor("thursday", "int", true),
            new FieldDescriptor("friday", "int", true),
            new FieldDescriptor("saturday", "int", true)
        ],
        DateTime
    );
}

export const DateTimeExamples = [
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
    }
]
