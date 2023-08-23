import { DslInterpreter } from "reactgenie-dsl";
import { DateTime } from "../src";
import { TimeDelta } from "../src";

test("test", () => {
  const allDescriptors = [TimeDelta.ClassDescriptor, DateTime.ClassDescriptor];

  const interpreter = new DslInterpreter([], true);
  const funcCallResult = interpreter.interpret(
    'Order.all().contains(field: .foods, value: Restaurant.current().menu.matching(field: .name, value: "hamburger")[0])[0].restaurant.name'
  );
});
