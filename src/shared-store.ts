import { GenieInterpreter } from "./modality-provider";
import {
  AllGenieObjectInterfaces,
  GenieInterfaceSpec,
  InstantiateGenieObject,
} from "./react-decorators";
import { shallowEqual, useSelector } from "react-redux";
import {
  DataClass,
  GenieObject,
  HelperClass,
  setSharedState,
} from "reactgenie-dsl";
import { genieDispatch, sharedState } from "reactgenie-dsl";

export type ReactGenieState = {
  message: {
    message: string;
    type: string;
  };
  navState: NavigatorState;
  navStack: number;
};

export let uiActive = true;

export interface NavigatorState {
  objectViewClassName: string | null;
  objectConstructorParams: any;
}

export const useGenieCodeSelector = (command: string) => {
  return async (state: any) => {
    uiActive = false;
    console.log(`before executing state ${JSON.stringify(state)}`);
    setSharedState(state);
    const result = await GenieInterpreter.dslInterpreter.interpret(command);
    console.log(`executed result ${result}`);
    console.log(`after executing state ${JSON.stringify(state)}`);
    uiActive = true;
    return result;
  };
};

const shallowEqualWithArray = (left: any, right: any) => {
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false;
    }
    for (let i = 0; i < left.length; i++) {
      if (!shallowEqualWithArray(left[i], right[i])) {
        return false;
      }
    }
    return true;
  } else {
    return shallowEqual(left, right);
  }
};

const convertGenieClassToState = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map((element) => convertGenieClassToState(element));
  } else if (
    obj === null ||
    obj === undefined ||
    obj.constructor === undefined
  ) {
    return obj;
  } else if (obj.constructor.prototype instanceof GenieObject) {
    if (obj.constructor.prototype instanceof DataClass) {
      return {
        __genieObjectType: "DataClass",
        __genieObjectClass: obj.constructor.name,
        __genieObjectKey: obj[obj.genieKey],
        ...obj.__getState(),
      };
    } else if (obj.constructor.prototype instanceof HelperClass) {
      return {
        __genieObjectType: "HelperClass",
        __genieObjectClass: obj.constructor.name,
        ...obj.localStore,
      };
    }
    throw new Error("Unknown GenieObject type");
  } else {
    return obj;
  }
};

export const useGenieSelector = (selector: any) => {
  let selectorResult: any = undefined;
  useSelector((state: any) => {
    setSharedState(state);
    selectorResult = selector(state);
    return convertGenieClassToState(selectorResult);
  }, shallowEqualWithArray);
  return selectorResult;
};

type GenieCodeResult = {
  success: boolean;
  results: [{ ast: any; result: any }];
};

function jsonifyResult(result: any) {
  let resultStr;
  if (result.type === "object") {
    if (
      result.objectType === "string" ||
      result.objectType === "int" ||
      result.objectType === "boolean" ||
      result.objectType === "float"
    ) {
      resultStr = { value: result.value };
    } else if (result.objectType === "void") {
      resultStr = { result: "done" };
    } else {
      resultStr = result.value.description();
    }
  } else if (result.type === "array") {
    resultStr = result.value.map((element) => jsonifyResult(element));
  }
  return resultStr;
}

function stringifyResult(result: any) {
  return JSON.stringify(jsonifyResult(result));
}

export function executeGenieCode(command: string): GenieCodeResult {
  return genieDispatch(async () => {
    console.log(`before executing state ${JSON.stringify(sharedState)}`);
    try {
      const result =
        await GenieInterpreter.dslInterpreter.interpretSteps(command);
      // console.log(`executed result ${result}`);
      return {
        success: true,
        results: result,
      };
    } catch (e) {
      const reactGenieState = sharedState as ReactGenieState;
      reactGenieState.message = {
        message: "Sorry, I don't understand...",
        type: "error",
      };
      return {
        success: false,
        results: [e],
      };
    }
  });
}

export function displayResult(
  executionResult: GenieCodeResult,
  transcript: string,
  parsed: string,
  genieInterfaces: GenieInterfaceSpec[],
) {
  genieDispatch(() => {
    let allDisplayingObjects = [];
    let displayingObject = null;
    let displayingObjectType = "";

    const result = executionResult.results;
    let lastResult = true;

    for (let i = result.length - 1; i >= 0; i--) {
      if (i != result.length - 1) {
        lastResult = false;
      }
      const step = result[i];
      allDisplayingObjects = [];
      console.log(`last executed step ${JSON.stringify(step)}`);
      const stepResult = step.result;
      if (stepResult.type === "object") {
        allDisplayingObjects.push(stepResult);
      } else if (stepResult.type === "array") {
        for (const element of stepResult.value) {
          allDisplayingObjects.push(element);
        }
      }
      // check if object can be displayed
      if (allDisplayingObjects.length === 1) {
        displayingObjectType = allDisplayingObjects[0].objectType;
        displayingObject = allDisplayingObjects[0];
      } else if (allDisplayingObjects.length > 1) {
        displayingObjectType = allDisplayingObjects[0].objectType + "[]";
        displayingObject = allDisplayingObjects;
      } else if (allDisplayingObjects.length === 0) {
        displayingObjectType = "undefined";
        displayingObject = null;
      }
      // if displayingObjectType in the keys of AllGenieObjectInterfaces
      if (AllGenieObjectInterfaces.supportedTypes.has(displayingObjectType)) {
        break;
      }
    }
    let cannotdisplay = false;
    let onScreen = true;
    let instantiatedDisplayingObject = null;
    if (displayingObject != null) {
      // if displayingObject is an array
      if (
        displayingObject instanceof Array &&
        displayingObject.length >= 1 &&
        displayingObject[0] instanceof DataClass
      ) {
        // always display
        onScreen = false;
        instantiatedDisplayingObject = [];
        for (const element of displayingObject) {
          const Instance = InstantiateGenieObject({
            className: element.objectType,
            key: element.value,
          });
          if (Instance === undefined) {
            cannotdisplay = true;
            break;
          }
          instantiatedDisplayingObject.push(Instance);
        }
      } else {
        const Instance = InstantiateGenieObject({
          className: displayingObject.objectType,
          key: displayingObject.value,
        });
        if (Instance === undefined) cannotdisplay = true;
        else {
          if (lastResult) {
            // always display
            onScreen = false;
          } else {
            // check if displayingObjects is on screen already
            const targetInterface = genieInterfaces.find(
              (genieInterface) =>
                genieInterface.className === Instance.constructor.name &&
                shallowEqual(
                  genieInterface.key,
                  Instance._getConstructorParams(),
                ),
            );
            if (!targetInterface) {
              onScreen = false;
            }
          }

          instantiatedDisplayingObject = Instance;
        }
      }
    }
    GenieInterpreter.nlParser
      .respond(
        transcript,
        parsed,
        stringifyResult(
          // now we only display the last result
          executionResult.results[executionResult.results.length - 1].result,
        ),
      )
      .then((result) => {
        console.log(`respond result: ${result}`);
        genieDispatch(() => {
          if (result !== null) {
            const reactGenieState = sharedState as ReactGenieState;
            reactGenieState.message = {
              message: result,
              type: "info",
            };
          }
          if (!onScreen && !cannotdisplay) {
            const reactGenieState = sharedState as ReactGenieState;
            reactGenieState.navState = {
              objectViewClassName: AllGenieObjectInterfaces.getInterfaces(
                instantiatedDisplayingObject,
              ).viewClassName,
              objectConstructorParams:
                allDisplayingObjects.length === 1
                  ? allDisplayingObjects[0].value._getConstructorParams()
                  : {
                      elements: allDisplayingObjects.map((displayingObject) =>
                        displayingObject.value._getConstructorParams(),
                      ),
                    },
            };
            reactGenieState.navStack += 1;
          }
        });
      });

    console.log(`after executing state ${JSON.stringify(sharedState)}`);
  });
}
