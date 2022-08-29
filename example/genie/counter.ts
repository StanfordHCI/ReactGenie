import {GenieKey, sharedState} from "reactgenie";
import {GenieClass, GenieFunction, GenieProperty, DataClass, float, int} from "reactgenie"
import "reflect-metadata";

@GenieClass("A counter")
export class Counter extends DataClass {
    @GenieKey
    @GenieProperty()
    public name: string;
    @GenieProperty()
    public type: string;
    @GenieProperty()
    public count: int;

    constructor({name, counterType}: {name: string, counterType: string}) {
        super({});
        this.count = 0;
        this.name = name.toLowerCase();
        this.type = counterType.toLowerCase();
    }

    @GenieProperty()
    static Version: float = 1.0;

    static setup() {
        Counter.CreateObject({name: "coin", counterType: "coin"})
        Counter.CreateObject({name: "tomato", counterType: "vegetable"})
        Counter.CreateObject({name: "potato", counterType: "vegetable"})
        Counter.CreateObject({name: "apple", counterType: "fruit"})
        Counter.CreateObject({name: "banana", counterType: "fruit"})
        Counter.CreateObject({name: "orange", counterType: "fruit"})
        Counter.CreateObject({name: "grape", counterType: "fruit"})
        Counter.CreateObject({name: "mango", counterType: "fruit"})
        Counter.CreateObject({name: "pineapple", counterType: "fruit"})
        Counter.CreateObject({name: "strawberry", counterType: "fruit"})
        Counter.CreateObject({name: "watermelon", counterType: "fruit"})
    }
    @GenieFunction()
    static GetCounter({name = ""}: {name?: string}): Counter {
        return Counter.GetObject({name: name});
    }

    @GenieFunction()
    increment(): void {
        this.count = this.count + 1;
    }

    @GenieFunction()
    decrement(): void {
        this.count -= 1;
    }

    description(): {} {
        return {
            "count": this.count
        }
    }
}

export const CounterExamples = [
    {
        user_utterance: "increment",
        example_parsed: "Counter.Current().increment()",
    },
    {
        user_utterance: "what is the count",
        example_parsed: "Counter.Current().count",
    },
    {
        user_utterance: "what is the count of potato",
        example_parsed: 'Counter.GetCounter(name: "potato").count',
    },
    {
        user_utterance: "increment potato counter",
        example_parsed: 'Counter.GetCounter(name: "potato").increment()',
    },
    {
        user_utterance: "show me all vegetables counters",
        example_parsed: 'Counter.All().matching(field: .type, value: "vegetable")',
    }
]