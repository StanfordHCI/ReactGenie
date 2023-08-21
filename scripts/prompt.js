#!/usr/bin/env node
"use strict";

var _reactgenieDsl = require("reactgenie-dsl");
const descriptors = [];
for (const key in _reactgenieDsl.AllGenieObjects) {
  descriptors.push(_reactgenieDsl.AllGenieObjects[key].ClassDescriptor);
}
console.log(descriptors);
