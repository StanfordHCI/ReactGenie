import { Counter } from "./genie/counter";
import React from "react";
import { GenieClassInterface } from "reactgenie-lib";
import { useGenieSelector, genieDispatch } from "reactgenie-lib";

const CounterViewImpl = (props: { name: string }) => {
  const counter: Counter = useGenieSelector(() => {
    return Counter.GetObject(props);
  });
  const counterValue = useGenieSelector(() => {
    return counter.count;
  });
  const counterType = useGenieSelector(() => {
    return counter.type;
  });
  return (
    <div>
      <label>[{counterType}]</label> <br /> <label>{props.name}: </label> <br />{" "}
      <label> {counterValue}</label>
      <button onClick={() => genieDispatch(() => counter.increment())}>
        +
      </button>
      <button onClick={() => genieDispatch(() => counter.decrement())}>
        -
      </button>
    </div>
  );
};

// typescript don't yet support function decorators: https://stackoverflow.com/a/39488555
export const CounterView = GenieClassInterface(
  (counter: Counter) => `${counter.name} Counter`,
  "Counter",
  1
)(CounterViewImpl);
