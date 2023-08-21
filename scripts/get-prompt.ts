import { AllGenieObjects } from "reactgenie-dsl";
import {DateTime} from "../src";
import { ClassDescriptor, GenieObject } from "reactgenie-dsl";

const descriptors: ClassDescriptor<GenieObject>[] = [DateTime.ClassDescriptor];

console.log(descriptors);
