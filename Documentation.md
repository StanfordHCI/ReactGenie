## ReactGenie Documentation

>  Version 0.1
>
> Shuning Zhang (shuningz@stanford.edu)

#### Installation

```shell
npm install --save reactgenie
```

#### Structure

The repo of reactgenie contains:

```yaml
- index.ts
- modality-provider.tsx
- shared-counterStore.ts
- decorator.ts
```

**Index** provides a combined import of all functions and outer packages we needed.

**Modality provider** provides the definition and abstract implementation of another modality (in our case for example, it is voice interface).

**Shared store** provides a combined definition and way of using state (based on redux) using our implementation of reactgenie. Based on that, you could operate on the state and extend to another state more easily.

**Decorator** contains the decorator definition and implementation for the object under this framework, "GenieClass", and interface anchor point under this framework, "GenieClassInterface". Using ***GenieClass***, we could collect the definition of different objects and parse voice input correspondingly into function calls when entering voice input. Using ***GenieClassInterface***, we could collect pages developers wanted to navigate to, then a stack navigator containing all these pages with decorator would be generated for usage. 

#### Usage

We highly recommend developers use react native / react js to develop their application and use redux to take control of their data and state. Under this framework, we also provided some demo applications for developers to refer to. (See ``./example/`` and corresponding sub-directory for more details)

For a normal application to be developed, developers should take care of the following things. 

1. Design their interfaces with decorators (object and interface) like below, they should mark all the objects which may have correlation with the voice interface with ``GenieClass``. Also, they should mark all the pages which they design to have navigation with ``GenieClassInterface``.

   `./example/CounterView.tsx`:
   ```typescript
   export const CounterView = GenieClassInterface((counter: Counter) => `${counter.name} Counter`, "Counter")(CounterViewImpl)
   ```
   `./example/genie/counter.ts`:
   ```typescript
   @GenieClass("A counter")
   export class Counter extends LampObject {
       public name: string;
   
       constructor({name}: {name: string}) {
           super();
           this.name = name;
       }
   
       _getConstructorParams(): any {
           return {
               name: this.name
           }
       }
       // ...
   }
   ```

2. Implement your own class (object) with class definition and provide ***corresponding descriptors following the below format***. Furthermore, you should give some ***simple examples*** as prompt to show how to transcript the voice input into concrete function calls.

   ```typescript
   // An example of descriptors
   static ClassDescriptor = new ClassDescriptor<Counter> (
   	"Counter",
   	[
   		new FuncDescriptor("GetCounter", [
               new ParamDescriptor("name", "string")
           ], "Counter", true),
           new FuncDescriptor("current", [], "Counter", true),
           new FuncDescriptor("getCount", [], "int", false),
           new FuncDescriptor("increment", [], "void", false),
           new FuncDescriptor("decrement", [], "void", false),
   	],
   	[],
   	Counter
   )
   // An example of examples showing how to transcript voice input into concrete function call
   export const CounterExamples = [
       {
           user_utterance: "increment",
           example_parsed: "Counter.current().increment()",
       },
       {
           user_utterance: "decrement",
           example_parsed: "Counter.current().decrement()",
       },
       {
           user_utterance: "what is the count",
           example_parsed: "Counter.current().getCount()",
       },
       {
           user_utterance: "what is the count of potato",
           example_parsed: 'Counter.GetCounter(name: "potato").getCount()',
       },
       {
           user_utterance: "what is the count of tomato",
           example_parsed: 'Counter.GetCounter(name: "tomato").getCount()',
       }
   ]
   ```

3. Wrap their interfaces with ``ModalityProvider`` or ``Provider``, thus they could easily add another modality (namely voice modality) based on auto generation.

   ```typescript
   const App = () => {
   
       return (
           <Provider store={store}>
               <ModalityProvider
                   examples={CounterExamples}
                   codexApiKey={"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"}>
                   <div style={styles.container}>
                       Potato Counter:
                       <CounterView name={"potato"}/>
                   </div>
               </ModalityProvider>
           </Provider>
       );
   };
   ```

4. Import corresponding functions from ``reactgenie``, ``redux`` and other necessary package, then add corresponding configurations in ``package.json``

   ```typescript
       "react-native-web": "~0.18.7",
       "react-redux": "^8.0.2",
       "reactgenie": "file:..",
       "redux": "^4.2.0"
   },
       "devDependencies": {
       "@babel/core": "^7.8.6",
       "@babel/plugin-proposal-decorators": "^7.7.4",
       "@babel/plugin-transform-react-constant-elements": "^7.7.4",
       "@types/react": "~16.9.23",
       "@types/react-native": "~0.61.17",
   ```

5. Note that you should config to enable decorators.

   ```json
   // tsconfig.json  
     "compilerOptions": {
       "experimentalDecorators": true,
       "allowSyntheticDefaultImports": true,
   ```

#### API Definition

##### genieSelector

###### Options

###### Usage Example

```typescript
const counter = useSelector((state: any) => {
        const result = genieSelector(`Counter.GetCounter(name: "${props.name}").getCount()`)(state)
        console.log(`CounterView: ${result.value}`)
        return result.value
    });
```

##### GenieClassInterface

###### Options

**title:**

meaning: the name of class interface

type: string | (any) => string

###### Usage Example

You should wrap it on the view function.

```typescript
export const CounterView = GenieClassInterface((counter: Counter) => `${counter.name} Counter`, "Counter")(CounterViewImpl)
```

##### ModalityProvider

###### Options

**examples:**

meaning: the example sentences used for parsing

type: ExampleParse[], an array of parsing examples

**codexApiKey:**

meaning: the key used for codex api

type: string, a string which is the api for codex

**children:**

meaning: the child element of modality provider, used for ui building

type: React.ReactElement

###### Usage Example

```typescript
const App = () => {
    return (
        <Provider store={store}>
            <ModalityProvider
                examples={CounterExamples}
                codexApiKey={"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"}>
                <div style={styles.container}>
                    Potato Counter:
                    <CounterView name={"potato"}/>
                </div>
            </ModalityProvider>
        </Provider>
    );
};
```

##### GenieClass

###### Options

**comment:**

meaning: the extra note added to the genie class

type: string

###### Usage Example

```typescript
@GenieClass("A counter")
export class Counter extends LampObject {
    public name: string;

    constructor({name}: {name: string}) {
        super();
        this.name = name;
    }
```

##### NavigateFunction

###### Options

null

###### Usage Example

```typescript
@GenieClass("A counter")
export class Counter extends LampObject {
    public name: string;
    ...
    @NavigateFunction()
    static GetCounter({name}: {name: string}): Counter {
        return new Counter({name: name});
    }
    ...
}
```







