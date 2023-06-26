import React from "react";
import {GenieClassInterface} from "reactgenie-lib"
import {CounterView} from "./CounterView";

const CounterListViewImpl = (props: { elements: { name: string }[] }) => {
    return (
        <div>
            {
                props.elements.map((element) => {
                    return <CounterView name={element.name} key={element.name}/>
                })
            }
        </div>
    )
}

// typescript don't yet support function decorators: https://stackoverflow.com/a/39488555
export const CounterListView = GenieClassInterface("Counters", "Counter[]")(CounterListViewImpl)