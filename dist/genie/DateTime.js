"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTime = void 0;
var _reactgenieDsl = require("reactgenie-dsl");
require("reflect-metadata");
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _class3;
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let DateTime = (_dec = (0, _reactgenieDsl.GenieClass)("Representing a date or time"), _dec2 = Reflect.metadata("design:type", Function), _dec3 = Reflect.metadata("design:paramtypes", [Object]), _dec4 = Reflect.metadata("design:destructuringparamtypes", [{
  year: Number,
  month: Number,
  day: Number,
  hour: Number,
  minute: Number,
  second: Number
}]), _dec5 = (0, _reactgenieDsl.GenieProperty)(), _dec6 = Reflect.metadata("design:type", Number), _dec7 = (0, _reactgenieDsl.GenieProperty)(), _dec8 = Reflect.metadata("design:type", Number), _dec9 = (0, _reactgenieDsl.GenieProperty)(), _dec10 = Reflect.metadata("design:type", Number), _dec11 = (0, _reactgenieDsl.GenieProperty)(), _dec12 = Reflect.metadata("design:type", String), _dec13 = (0, _reactgenieDsl.GenieProperty)(), _dec14 = Reflect.metadata("design:type", Number), _dec15 = (0, _reactgenieDsl.GenieProperty)(), _dec16 = Reflect.metadata("design:type", Number), _dec17 = (0, _reactgenieDsl.GenieProperty)(), _dec18 = Reflect.metadata("design:type", Number), _dec19 = (0, _reactgenieDsl.GenieFunction)("Get the current date time"), _dec20 = Reflect.metadata("design:type", Function), _dec21 = Reflect.metadata("design:paramtypes", []), _dec22 = Reflect.metadata("design:returntype", "DateTime"), _dec23 = Reflect.metadata("design:is_static", true), _dec24 = (0, _reactgenieDsl.GenieFunction)("Create a new date time object"), _dec25 = Reflect.metadata("design:type", Function), _dec26 = Reflect.metadata("design:paramtypes", [Object]), _dec27 = Reflect.metadata("design:returntype", "DateTime"), _dec28 = Reflect.metadata("design:destructuringparamtypes", [{
  year: Number,
  month: Number,
  day: Number,
  hour: Number,
  minute: Number
}]), _dec29 = (0, _reactgenieDsl.GenieFunction)("Add a date offset to the current date"), _dec30 = Reflect.metadata("design:type", Function), _dec31 = Reflect.metadata("design:paramtypes", [Object]), _dec32 = Reflect.metadata("design:returntype", "DateTime"), _dec33 = Reflect.metadata("design:destructuringparamtypes", [{
  year: Number,
  month: Number,
  day: Number,
  hour: Number,
  minute: Number,
  second: Number
}]), _dec34 = (0, _reactgenieDsl.GenieFunction)("Get the date of the DateTime object"), _dec35 = Reflect.metadata("design:type", Function), _dec36 = Reflect.metadata("design:paramtypes", []), _dec37 = Reflect.metadata("design:returntype", typeof Date === "undefined" ? "Date" : Date), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_class3 = class DateTime extends _reactgenieDsl.HelperClass {
  constructor({
    year = undefined,
    month = undefined,
    day = undefined,
    hour = undefined,
    minute = undefined,
    second = undefined
  }) {
    super({});
    _initializerDefineProperty(this, "year", _descriptor, this);
    _initializerDefineProperty(this, "month", _descriptor2, this);
    _initializerDefineProperty(this, "day", _descriptor3, this);
    _initializerDefineProperty(this, "dayOfWeek", _descriptor4, this);
    _initializerDefineProperty(this, "hour", _descriptor5, this);
    _initializerDefineProperty(this, "minute", _descriptor6, this);
    _initializerDefineProperty(this, "second", _descriptor7, this);
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
  static compare(a, b) {
    return a.getDate().getTime() - b.getDate().getTime();
  }
  static fromString(data) {
    let date;
    // const dt = DateTime.CreateObject({});
    const dt = DateTime.CreateObject({});
    if (data == "today") date = new Date();else if (data == "yesterday") {
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
    dt.dayOfWeek = date.toLocaleDateString("en-US", {
      weekday: "long"
    });
    return dt;
  }
  static today() {
    return DateTime.fromString("today");
  }
  CreateDatetime({
    year = undefined,
    month = undefined,
    day = undefined,
    hour = undefined,
    minute = undefined
  }) {
    return DateTime.CreateObject({
      year,
      month,
      day,
      hour,
      minute
    });
  }
  addDateOffset({
    year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
    second = 0
  }) {
    this.year = this.year + year;
    this.month = this.month + month;
    this.day = this.day + day;
    this.hour = this.hour + hour;
    this.minute = this.minute + minute;
    this.second = this.second + second;
    return this;
  }
  getDate() {
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
}, _class3.sunday = 0, _class3.monday = 1, _class3.tuesday = 2, _class3.wednesday = 3, _class3.thursday = 4, _class3.friday = 5, _class3.saturday = 6, _class3.Examples = [{
  user_utterance: "yesterday",
  example_parsed: "DateTime.today().addDateOffset(day: -1)"
}, {
  user_utterance: "tomorrow",
  example_parsed: "DateTime.today().addDateOffset(day: 1)"
}, {
  user_utterance: "next week",
  example_parsed: "DateTime.today().addDateOffset(day: 7)"
}], _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "year", [_dec5, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "month", [_dec7, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "day", [_dec9, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "dayOfWeek", [_dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "hour", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "minute", [_dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "second", [_dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "today", [_dec19, _dec20, _dec21, _dec22, _dec23], Object.getOwnPropertyDescriptor(_class2, "today"), _class2), _applyDecoratedDescriptor(_class2.prototype, "CreateDatetime", [_dec24, _dec25, _dec26, _dec27, _dec28], Object.getOwnPropertyDescriptor(_class2.prototype, "CreateDatetime"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "addDateOffset", [_dec29, _dec30, _dec31, _dec32, _dec33], Object.getOwnPropertyDescriptor(_class2.prototype, "addDateOffset"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getDate", [_dec34, _dec35, _dec36, _dec37], Object.getOwnPropertyDescriptor(_class2.prototype, "getDate"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
exports.DateTime = DateTime;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3RnZW5pZURzbCIsInJlcXVpcmUiLCJfZGVjIiwiX2RlYzIiLCJfZGVjMyIsIl9kZWM0IiwiX2RlYzUiLCJfZGVjNiIsIl9kZWM3IiwiX2RlYzgiLCJfZGVjOSIsIl9kZWMxMCIsIl9kZWMxMSIsIl9kZWMxMiIsIl9kZWMxMyIsIl9kZWMxNCIsIl9kZWMxNSIsIl9kZWMxNiIsIl9kZWMxNyIsIl9kZWMxOCIsIl9kZWMxOSIsIl9kZWMyMCIsIl9kZWMyMSIsIl9kZWMyMiIsIl9kZWMyMyIsIl9kZWMyNCIsIl9kZWMyNSIsIl9kZWMyNiIsIl9kZWMyNyIsIl9kZWMyOCIsIl9kZWMyOSIsIl9kZWMzMCIsIl9kZWMzMSIsIl9kZWMzMiIsIl9kZWMzMyIsIl9kZWMzNCIsIl9kZWMzNSIsIl9kZWMzNiIsIl9kZWMzNyIsIl9jbGFzcyIsIl9jbGFzczIiLCJfZGVzY3JpcHRvciIsIl9kZXNjcmlwdG9yMiIsIl9kZXNjcmlwdG9yMyIsIl9kZXNjcmlwdG9yNCIsIl9kZXNjcmlwdG9yNSIsIl9kZXNjcmlwdG9yNiIsIl9kZXNjcmlwdG9yNyIsIl9jbGFzczMiLCJfaW5pdGlhbGl6ZXJEZWZpbmVQcm9wZXJ0eSIsInRhcmdldCIsInByb3BlcnR5IiwiZGVzY3JpcHRvciIsImNvbnRleHQiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInZhbHVlIiwiaW5pdGlhbGl6ZXIiLCJjYWxsIiwiX2FwcGx5RGVjb3JhdGVkRGVzY3JpcHRvciIsImRlY29yYXRvcnMiLCJkZXNjIiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJzbGljZSIsInJldmVyc2UiLCJyZWR1Y2UiLCJkZWNvcmF0b3IiLCJ1bmRlZmluZWQiLCJfaW5pdGlhbGl6ZXJXYXJuaW5nSGVscGVyIiwiRXJyb3IiLCJEYXRlVGltZSIsIkdlbmllQ2xhc3MiLCJSZWZsZWN0IiwibWV0YWRhdGEiLCJGdW5jdGlvbiIsInllYXIiLCJOdW1iZXIiLCJtb250aCIsImRheSIsImhvdXIiLCJtaW51dGUiLCJzZWNvbmQiLCJHZW5pZVByb3BlcnR5IiwiU3RyaW5nIiwiR2VuaWVGdW5jdGlvbiIsIkRhdGUiLCJIZWxwZXJDbGFzcyIsImNvbnN0cnVjdG9yIiwiZGF5T2ZXZWVrIiwic2V0dXAiLCJjb21wYXJlIiwiYSIsImIiLCJnZXREYXRlIiwiZ2V0VGltZSIsImZyb21TdHJpbmciLCJkYXRhIiwiZGF0ZSIsImR0IiwiQ3JlYXRlT2JqZWN0Iiwic2V0RGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwid2Vla2RheSIsInRvZGF5IiwiQ3JlYXRlRGF0ZXRpbWUiLCJhZGREYXRlT2Zmc2V0Iiwic2V0RnVsbFllYXIiLCJzZXRNb250aCIsInNldEhvdXJzIiwic2V0TWludXRlcyIsInNldFNlY29uZHMiLCJ0b1N0cmluZyIsInN1bmRheSIsIm1vbmRheSIsInR1ZXNkYXkiLCJ3ZWRuZXNkYXkiLCJ0aHVyc2RheSIsImZyaWRheSIsInNhdHVyZGF5IiwiRXhhbXBsZXMiLCJ1c2VyX3V0dGVyYW5jZSIsImV4YW1wbGVfcGFyc2VkIiwicHJvdG90eXBlIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZW5pZS9EYXRlVGltZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBHZW5pZUNsYXNzLFxuICBIZWxwZXJDbGFzcyxcbiAgR2VuaWVQcm9wZXJ0eSxcbiAgR2VuaWVGdW5jdGlvbixcbn0gZnJvbSBcInJlYWN0Z2VuaWUtZHNsXCI7XG5pbXBvcnQgXCJyZWZsZWN0LW1ldGFkYXRhXCI7XG5cbkBHZW5pZUNsYXNzKFwiUmVwcmVzZW50aW5nIGEgZGF0ZSBvciB0aW1lXCIpXG5leHBvcnQgY2xhc3MgRGF0ZVRpbWUgZXh0ZW5kcyBIZWxwZXJDbGFzcyB7XG4gIEBHZW5pZVByb3BlcnR5KClcbiAgcHVibGljIHllYXI6IG51bWJlcjtcbiAgQEdlbmllUHJvcGVydHkoKVxuICBwdWJsaWMgbW9udGg6IG51bWJlcjtcbiAgQEdlbmllUHJvcGVydHkoKVxuICBwdWJsaWMgZGF5OiBudW1iZXI7XG4gIEBHZW5pZVByb3BlcnR5KClcbiAgcHVibGljIGRheU9mV2Vlazogc3RyaW5nO1xuICBAR2VuaWVQcm9wZXJ0eSgpXG4gIHB1YmxpYyBob3VyOiBudW1iZXI7XG4gIEBHZW5pZVByb3BlcnR5KClcbiAgcHVibGljIG1pbnV0ZTogbnVtYmVyO1xuICBAR2VuaWVQcm9wZXJ0eSgpXG4gIHB1YmxpYyBzZWNvbmQ6IG51bWJlcjtcbiAgLy8gcHVibGljIGRhdGU7XG5cbiAgc3RhdGljIHN1bmRheSA9IDA7XG4gIHN0YXRpYyBtb25kYXkgPSAxO1xuICBzdGF0aWMgdHVlc2RheSA9IDI7XG4gIHN0YXRpYyB3ZWRuZXNkYXkgPSAzO1xuICBzdGF0aWMgdGh1cnNkYXkgPSA0O1xuICBzdGF0aWMgZnJpZGF5ID0gNTtcbiAgc3RhdGljIHNhdHVyZGF5ID0gNjtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgeWVhciA9IHVuZGVmaW5lZCxcbiAgICBtb250aCA9IHVuZGVmaW5lZCxcbiAgICBkYXkgPSB1bmRlZmluZWQsXG4gICAgaG91ciA9IHVuZGVmaW5lZCxcbiAgICBtaW51dGUgPSB1bmRlZmluZWQsXG4gICAgc2Vjb25kID0gdW5kZWZpbmVkLFxuICB9OiB7XG4gICAgeWVhcj86IG51bWJlcjtcbiAgICBtb250aD86IG51bWJlcjtcbiAgICBkYXk/OiBudW1iZXI7XG4gICAgaG91cj86IG51bWJlcjtcbiAgICBtaW51dGU/OiBudW1iZXI7XG4gICAgc2Vjb25kPzogbnVtYmVyO1xuICB9KSB7XG4gICAgc3VwZXIoe30pO1xuICAgIHRoaXMueWVhciA9IDA7XG4gICAgdGhpcy5tb250aCA9IDA7XG4gICAgdGhpcy5kYXkgPSAwO1xuICAgIHRoaXMuaG91ciA9IDA7XG4gICAgdGhpcy5taW51dGUgPSAwO1xuICAgIHRoaXMuc2Vjb25kID0gMDtcbiAgICB0aGlzLmRheU9mV2VlayA9IFwiXCI7XG4gICAgLy8gdGhpcy5zZXREYXRlKHt5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGV9KTtcbiAgfVxuXG4gIHN0YXRpYyBzZXR1cCgpIHt9XG5cbiAgLy8gY3VzdG9tIGNvbXBhcmF0b3IgZm9yIHNvcnRpbmdcbiAgc3RhdGljIGNvbXBhcmUoYTogRGF0ZVRpbWUsIGI6IERhdGVUaW1lKSB7XG4gICAgcmV0dXJuIGEuZ2V0RGF0ZSgpLmdldFRpbWUoKSAtIGIuZ2V0RGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tU3RyaW5nKGRhdGE6IHN0cmluZykge1xuICAgIGxldCBkYXRlOiBEYXRlO1xuICAgIC8vIGNvbnN0IGR0ID0gRGF0ZVRpbWUuQ3JlYXRlT2JqZWN0KHt9KTtcbiAgICBjb25zdCBkdCA9IERhdGVUaW1lLkNyZWF0ZU9iamVjdCh7fSk7XG4gICAgaWYgKGRhdGEgPT0gXCJ0b2RheVwiKSBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBlbHNlIGlmIChkYXRhID09IFwieWVzdGVyZGF5XCIpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMSk7XG4gICAgfSBlbHNlIGlmIChkYXRhID09IFwiYmVmb3JlWWVzdGVyZGF5XCIpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMSk7XG4gICAgfSBlbHNlIGRhdGUgPSBuZXcgRGF0ZShkYXRhKTtcbiAgICBkdC55ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIGR0Lm1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xuICAgIGR0LmRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIGR0LmhvdXIgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgZHQubWludXRlID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgZHQuc2Vjb25kID0gZGF0ZS5nZXRTZWNvbmRzKCk7XG4gICAgZHQuZGF5T2ZXZWVrID0gZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoXCJlbi1VU1wiLCB7IHdlZWtkYXk6IFwibG9uZ1wiIH0pO1xuICAgIHJldHVybiBkdDtcbiAgfVxuXG4gIEBHZW5pZUZ1bmN0aW9uKFwiR2V0IHRoZSBjdXJyZW50IGRhdGUgdGltZVwiKVxuICBzdGF0aWMgdG9kYXkoKTogRGF0ZVRpbWUge1xuICAgIHJldHVybiBEYXRlVGltZS5mcm9tU3RyaW5nKFwidG9kYXlcIik7XG4gIH1cblxuICBAR2VuaWVGdW5jdGlvbihcIkNyZWF0ZSBhIG5ldyBkYXRlIHRpbWUgb2JqZWN0XCIpXG4gIENyZWF0ZURhdGV0aW1lKHtcbiAgICB5ZWFyID0gdW5kZWZpbmVkLFxuICAgIG1vbnRoID0gdW5kZWZpbmVkLFxuICAgIGRheSA9IHVuZGVmaW5lZCxcbiAgICBob3VyID0gdW5kZWZpbmVkLFxuICAgIG1pbnV0ZSA9IHVuZGVmaW5lZCxcbiAgfToge1xuICAgIHllYXI/OiBudW1iZXI7XG4gICAgbW9udGg/OiBudW1iZXI7XG4gICAgZGF5PzogbnVtYmVyO1xuICAgIGhvdXI/OiBudW1iZXI7XG4gICAgbWludXRlPzogbnVtYmVyO1xuICB9KTogRGF0ZVRpbWUge1xuICAgIHJldHVybiBEYXRlVGltZS5DcmVhdGVPYmplY3QoeyB5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUgfSk7XG4gIH1cblxuICBAR2VuaWVGdW5jdGlvbihcIkFkZCBhIGRhdGUgb2Zmc2V0IHRvIHRoZSBjdXJyZW50IGRhdGVcIilcbiAgYWRkRGF0ZU9mZnNldCh7XG4gICAgeWVhciA9IDAsXG4gICAgbW9udGggPSAwLFxuICAgIGRheSA9IDAsXG4gICAgaG91ciA9IDAsXG4gICAgbWludXRlID0gMCxcbiAgICBzZWNvbmQgPSAwLFxuICB9OiB7XG4gICAgeWVhcj86IG51bWJlcjtcbiAgICBtb250aD86IG51bWJlcjtcbiAgICBkYXk/OiBudW1iZXI7XG4gICAgaG91cj86IG51bWJlcjtcbiAgICBtaW51dGU/OiBudW1iZXI7XG4gICAgc2Vjb25kPzogbnVtYmVyO1xuICB9KTogRGF0ZVRpbWUge1xuICAgIHRoaXMueWVhciA9IHRoaXMueWVhciArIHllYXI7XG4gICAgdGhpcy5tb250aCA9IHRoaXMubW9udGggKyBtb250aDtcbiAgICB0aGlzLmRheSA9IHRoaXMuZGF5ICsgZGF5O1xuICAgIHRoaXMuaG91ciA9IHRoaXMuaG91ciArIGhvdXI7XG4gICAgdGhpcy5taW51dGUgPSB0aGlzLm1pbnV0ZSArIG1pbnV0ZTtcbiAgICB0aGlzLnNlY29uZCA9IHRoaXMuc2Vjb25kICsgc2Vjb25kO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgQEdlbmllRnVuY3Rpb24oXCJHZXQgdGhlIGRhdGUgb2YgdGhlIERhdGVUaW1lIG9iamVjdFwiKVxuICBnZXREYXRlKCk6IERhdGUge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGRhdGUuc2V0RnVsbFllYXIodGhpcy55ZWFyKTtcbiAgICBkYXRlLnNldE1vbnRoKHRoaXMubW9udGgpO1xuICAgIGRhdGUuc2V0RGF0ZSh0aGlzLmRheSk7XG4gICAgZGF0ZS5zZXRIb3Vycyh0aGlzLmhvdXIpO1xuICAgIGRhdGUuc2V0TWludXRlcyh0aGlzLm1pbnV0ZSk7XG4gICAgZGF0ZS5zZXRTZWNvbmRzKHRoaXMuc2Vjb25kKTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuXG4gIC8vIEBHZW5pZUZ1bmN0aW9uKFwiU2V0IHRoZSBkYXRlIG9mIHRoZSBkYXRlIHRpbWUgb2JqZWN0XCIpXG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMueWVhcn0tJHt0aGlzLm1vbnRofS0ke3RoaXMuZGF5fWA7XG4gIH1cblxuICBzdGF0aWMgRXhhbXBsZXMgPSBbXG4gICAge1xuICAgICAgdXNlcl91dHRlcmFuY2U6IFwieWVzdGVyZGF5XCIsXG4gICAgICBleGFtcGxlX3BhcnNlZDogXCJEYXRlVGltZS50b2RheSgpLmFkZERhdGVPZmZzZXQoZGF5OiAtMSlcIixcbiAgICB9LFxuICAgIHtcbiAgICAgIHVzZXJfdXR0ZXJhbmNlOiBcInRvbW9ycm93XCIsXG4gICAgICBleGFtcGxlX3BhcnNlZDogXCJEYXRlVGltZS50b2RheSgpLmFkZERhdGVPZmZzZXQoZGF5OiAxKVwiLFxuICAgIH0sXG4gICAge1xuICAgICAgdXNlcl91dHRlcmFuY2U6IFwibmV4dCB3ZWVrXCIsXG4gICAgICBleGFtcGxlX3BhcnNlZDogXCJEYXRlVGltZS50b2RheSgpLmFkZERhdGVPZmZzZXQoZGF5OiA3KVwiLFxuICAgIH0sXG4gIF07XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLGNBQUEsR0FBQUMsT0FBQTtBQU1BQSxPQUFBO0FBQTBCLElBQUFDLElBQUEsRUFBQUMsS0FBQSxFQUFBQyxLQUFBLEVBQUFDLEtBQUEsRUFBQUMsS0FBQSxFQUFBQyxLQUFBLEVBQUFDLEtBQUEsRUFBQUMsS0FBQSxFQUFBQyxLQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxPQUFBLEVBQUFDLFdBQUEsRUFBQUMsWUFBQSxFQUFBQyxZQUFBLEVBQUFDLFlBQUEsRUFBQUMsWUFBQSxFQUFBQyxZQUFBLEVBQUFDLFlBQUEsRUFBQUMsT0FBQTtBQUFBLFNB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