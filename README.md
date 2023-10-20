# ReactGenie

> A Toolkit for Multimodal Applications

[![NPM](https://img.shields.io/npm/v/reactgenie-lib.svg)](https://www.npmjs.com/package/reactgenie-lib) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)



## Introduction

**ReactGenie** is a programming framework that uses an object-oriented state abstraction approach to seamlessly support building complex multimodal mobile applications. **ReactGenie** enables developers to define both the content and actions in an app and automatically handles the natural language understanding and composition of different modalities by generating a parser that leverages large language models (LLMs).



## **Installation**

**ReactGenie** can be easily installed with NPM.

```bash
npm install --save reactgenie-lib
```



## Getting Started

Here is a simple example built with **ReactGenie**

```jsx
import React, { Component } from 'react'

import MyComponent from 'reactgenie-lib'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

The **ReactGenie** library provides a counter example for multimodal interaction, which can be deployed as follows：

> 1. Go to the `example` folder.
>
>    ```bash
>    cd example 
>    ```
>
> 2. Replace the api key with your own keys in `.env.example`  and then rename the file to `.env` .
>
> 3. Install related modules.
>
>    ```bash
>    npm install
>    ```
>
> 4.  Get started with following command.
>
>    ```bash
>    npx expo start --web
>    ```
>
>    Or you can also start the project by linking the lib locally with
>
>    ```bash
>    if [ -d "./node_modules/reactgenie-lib" ]; then rm -r ./node_modules/reactgenie-lib; fi && npm install --install-links && npx expo start --web
>    ```



## API Reference

### ReactGenie Decorators

> When using **ReactGenie**, developers can use various decorators to declare classes, variables or functions; **ReactGenie** will **automatically process and serialize** related variables according to the developer's description, and **automatically generate functions and LLM prompts** for supporting multimodal input processing according to the description information provided by the developer.

#### @GenieClass

GenieClass is a basic decorator for object-oriented programs. Classes with @GenieClass are automatically processed by **ReactGenie**. Developers can declare basic information about the class by adding a description for prompt generation to the class. For example:

``` typescript
import {GenieClass, HelperClass} from "reactgenie-lib"

@GenieClass("Representing a date or time")
export class DateTime extends HelperClass{
  	//...
}
```

Classes with the **@GenieClass** can create instances using the **CreateObject()**, and the system will automatically call the **setup()** initialize  the data. For more details, please refer to **ReactGenie Functions**.

Considering the data types of different classes, GenieClass provides two types of classes that can be inherited: **DataClass** and **HelperClass**. <font color='red'>**Please avoid directly inheriting from GenieClass !**</font>



##### DataClass

A Dataclass is the basic unit for data management, and an instance of a dataclass can be viewed as a record in a database. The property in a Dataclass can be a number, string, boolean, list, DataClass, or a Helperclass. 

Each dataclass has a unique key for **ReactGenie** to manage. For each instance, information about the instance can be obtained using **GetObject(key)**. Here is an example for DataClass:

```typescript
import {GenieClass, DataClass, GenieKey, GenieProperty} from "reactgenie-lib"

@GenieClass("An order")
export class Order extends DataClass {
    @GenieKey
    @GenieProperty()
    public id: string;
    @GenieProperty("The items in the order.")
    public items: OrderItem[] = [];
    @GenieProperty("The date and time the order was placed.")
    public placedTime: DateTime; //DateTime is a HelperClass
  	//...
  
  	//functions...
}
```

Complex data types in Dataclass will be stored using Helperclass, otherwise they cannot be serialized and stored correctly.



##### HelperClass

The helperclass is an auxiliary data storage and processing type that depends on the dataclass. Helperclass will not be stored directly in the database, but are serialized and deserialized as they are stored in and retrieved from the dataclass, helping the dataclass manage complex data types. The property in a Dataclass can be a number, string, boolean, list, DataClass, or a Helperclass. 

HelperClass has no key, but can also be instantiated using **CreatObject()**. Here is an example for HelperClass:

```typescript
import {GenieClass, HelperClass} from "reactgenie-lib"

@GenieClass("order item")
export class OrderItem extends HelperClass {
    @GenieProperty()
    public foodItem: FoodItem; //Fooditem is a DataClass
    @GenieProperty()
    public quantity: int;
    //...
  
  	//functions...
}
```



#### @GenieKey

Geniekey is the identification of ReactGenie for data management, and each DataClass requires a GenieKey. Use @GenieKey to modify the property that is used as the key in the class, which can be used to get the instance after it is created. For example:

```typescript
import {GenieClass, DataClass, GenieKey, GenieProperty} from "reactgenie-lib"

@GenieClass("An Counter")
export class Counter extends DataClass {
    @GenieKey
    @GenieProperty()
    public name: string;
    @GenieProperty()
    public quantity: int;

  	//...
  
  	//functions...
  	constructor({name, quantity}:{name:string, quantity:int}){
			super({});
      this.name = name;
      this.quantity = quantity;
    }
  
  	static setup(){
      Counter.CreateObject({name:"Coin", quantity:5});
    }
}

//Get instance
Counter coin_count = Counter.GetObject({name:"Coin"});
  //coin_count.name: "Coin"
  //coin_count.quantity: 5
```



#### @GenieProperty

The GenieProperty modifier is used to modify properties that you want to be accessed and managed by ReactGenie. All members modified with GenieProperty are serialized and stored, and are used for access for multimodal interactions. Developers can also add a description of the property for prompt generation. For example

```typescript
//...
@GenieProperty()
public id: string;
@GenieProperty("The items in the order.")
public items: OrderItem[] = [];
@GenieProperty("The date and time the order was placed.")
public placedTime: DateTime; //DateTime is a HelperClass
//...
```



#### @GenieFunction

All functions modified by GenieFunction can be called by ReactGenie automatically during multimodal interactions. Developers can add description to the GeniceFunction to state what this function is used for. 

<font color='red'>**Please notice that each GenieFunction should have a return value.**</font>

```typescript
@GenieFunction("Get the total price of the active order.")
    getTotalPrice(): float {
        // calculates the total price of the order
      	// ...

      return total;
    }

@GenieFunction("Add one item to the order.")
    addItems({items}: {items: OrderItem[]}): Order {
        // add item to the cart
      	// ...
      
      return this;
    }
```



### ReactGenie Functions

> **ReactGenie** provides developers with some auto-generated functions to help them implement multimodal interactive applications. These functions help developers reduce their workload and increase development efficiency.

#### set_up()

The setup function is a static function of Genieclass. Developers can override the setup function for initial program setup. The setup function is generally used for initial data import and instantiation. ReactGenie will automatically call the setup function to complete the initialization. For example

```typescript
//Counter 
static setup() {
    Counter.CreateObject({ name: "potato", counterType: "vegetable" });
    Counter.CreateObject({ name: "apple", counterType: "fruit" });
    Counter.CreateObject({ name: "banana", counterType: "fruit" });
    Counter.CreateObject({ name: "orange", counterType: "fruit" });
    Counter.CreateObject({ name: "grape", counterType: "fruit" });
    Counter.CreateObject({ name: "mango", counterType: "fruit" });
    Counter.CreateObject({ name: "pineapple", counterType: "fruit" });
    Counter.CreateObject({ name: "strawberry", counterType: "fruit" });
    Counter.CreateObject({ name: "watermelon", counterType: "fruit" });
  }
```

The call order of Setup is uncertain, if the initialization process needs to strictly formulate the execution order, for example, the property of dataclass B contains dataclass A, you need to complete the initialization of A before completing the initialization of B, please build a static manul_setup function and manually set up the call order after **initReactGenie()**.

```typescript
//manul setup
export const orderStore = initReactGenie();
Restaurant.manual_setup();
FoodItem.manual_setup();
Order.manual_setup();
```



#### CreateObject()

CreateObject() is a static member of GenieClass. All instances of GenieClass need to be created using `CreateObject()`, which automatically calls the class constructor and sets getters and setters for the properties in it. <font color="red">Please avoid directly using `new Class()`.</font>

```typescript
//
Counter.CreateObject({ name: "potato", counterType: "vegetable" });
```



#### GetObject()

GetObject() is automatically generated by ReactGenie. Only instance of dataclass can be accessed by GetObject() with its key.

```typescript
//
Counter coin_count = Counter.GetObject({name:"Coin"});

//
@GenieFunction()
  static GetCounter({name = ""}: {name?: string}): Counter {
      return Counter.GetObject({name: name});
  }

```



#### Current()

Current() gets the currently active target and is also dynamically updated based on user clicks. Current() is automatically generated by rg and developers do not need to implement this function. Only dataclass has the Current().

```typescript

Coin : 5

//User click on Coin Counter
Counter.Current().count //5
```



#### All()

All()  gets a array of all instances of a specific class. All() is automatically generated by rg and developers do not need to implement this function. Only dataclass has the All(). For example:

```typescript
//
Order.All().filter((order) => {
            return !order.orderPlaced;
        })
```



### ReactGenie PromptExamples

> To give LLM a better understanding of function calls and capabilities, developers can give examples in the class for emphasis. The cases given by the developer will automatically generate prompts to be delivered to LLM for automated responses for multimodal interactions.

The examples should be contained in the ModalityProvider.

```typescript
//Counter.ts
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
  },
];

//App.tsx
 <ModalityProvider
        examples={CounterExamples}
        //...>
          
       //...  
</ModalityProvider>
```



## Examples or Tutorials

### MultiReactFoodOrdering








## License

Apache-2.0 © [Jackie Yang](https://github.com/valkjsaaa)
