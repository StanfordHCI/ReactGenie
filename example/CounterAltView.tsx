import { Counter } from "./genie/counter";
import React from "react";
import { GenieClassInterface } from "reactgenie-lib";
import { useGenieSelector, genieDispatch } from "reactgenie-lib";

const CounterAltViewImpl = (props: { name: string }) => {
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
    <div
      style={{
        transform: "scale(2, 2)",
        transformOrigin: "top left",
        marginBottom: "100px",
      }}
    >
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

const bigCounterPriority = (target: Counter) => {
  if (target.name === "coin") {
    return 10;
  }
  return 0;
};

// typescript don't yet support function decorators: https://stackoverflow.com/a/39488555
export const CounterAltView = GenieClassInterface(
  "Counter",
  "Counter",
  bigCounterPriority
)(CounterAltViewImpl);
