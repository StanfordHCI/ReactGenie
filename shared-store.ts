import { GenieInterpreter } from "./modality-provider";
import {
  AllGenieObjectInterfaces,
  InstantiateGenieObject,
  RetrieveInterfaces,
} from "./react-decorators";
import { shallowEqual, useSelector } from "react-redux";
import { setSharedState } from "reactgenie-dsl";
import { genieDispatch, sharedState } from "reactgenie-dsl";

export type ReactGenieState = {
  message: {
    message: string;
    type: string;
  };
  command: {
    command: string;
    result: any;
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
  return (state: any) => {
    uiActive = false;
    console.log(`before executing state ${JSON.stringify(state)}`);
    setSharedState(state);
    const result = GenieInterpreter.dslInterpreter.interpret(command);
    console.log(`executed result ${result}`);
    console.log(`after executing state ${JSON.stringify(state)}`);
    uiActive = true;
    return result;
  };
};

export const useGenieSelector = (selector: any) => {
  return useSelector((state: any) => {
    setSharedState(state);
    return selector(state);
  });
};

export let genieCommandSuccess = true;

type GenieCodeResult = [{ result }];

export function executeGenieCode(command: string): GenieCodeResult | null {
  return genieDispatch(() => {
    console.log(`before executing state ${JSON.stringify(sharedState)}`);
    try {
      let result = GenieInterpreter.dslInterpreter.interpretSteps(command);
      let resultStr = "";
      if (result.length > 0) {
        let lastResult = result[result.length - 1];
        if (lastResult.result.type === "object") {
          if (
            lastResult.result.objectType === "string" ||
            lastResult.result.objectType === "int" ||
            lastResult.result.objectType === "boolean"
          ) {
            resultStr = JSON.stringify({ value: lastResult.result.value });
          } else if (lastResult.result.objectType === "void") {
            resultStr = '{"result": "done"}';
          } else {
            resultStr = JSON.stringify(lastResult.result.value.description());
          }
        } else if (lastResult.result.type === "array") {
          resultStr = JSON.stringify(
            lastResult.result.value.map((element) =>
              element.value.description()
            )
          );
        }
      }
      let reactGenieState = sharedState as ReactGenieState;
      reactGenieState.command = {
        command: command,
        result: resultStr,
      };
      genieCommandSuccess = true;
      return result;
    } catch (e) {
      let reactGenieState = sharedState as ReactGenieState;
      reactGenieState.message = {
        message: "Sorry, I don't understand...",
        type: "error",
      };
      genieCommandSuccess = false;
    }
    return null;
  });
}

export function displayResult(result: GenieCodeResult) {
  genieDispatch(() => {
    const genieInterfaces = RetrieveInterfaces();
    let allDisplayingObjects = [];
    let displayingObject = null;
    let displayingObjectType = "";
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
    let onScreen = true;
    let instantiatedDisplayingObject = null;
    if (displayingObject != null) {
      // if displayingObject is an array
      if (displayingObject instanceof Array) {
        // always display
        onScreen = false;
        instantiatedDisplayingObject = [];
        for (const element of displayingObject) {
          const Instance = InstantiateGenieObject({
            className: element.objectType,
            key: element.value,
          });
          instantiatedDisplayingObject.push(Instance);
        }
      } else {
        const Instance = InstantiateGenieObject({
          className: displayingObject.objectType,
          key: displayingObject.value,
        });
        if (lastResult) {
          // always display
          onScreen = false;
        } else {
          // check if displayingObjects is on screen already
          const targetInterface = genieInterfaces.find(
            (genieInterface) =>
              genieInterface.className === Instance.constructor.name &&
              shallowEqual(genieInterface.key, Instance._getConstructorParams())
          );
          if (!targetInterface) {
            onScreen = false;
          }
        }
        instantiatedDisplayingObject = Instance;
      }
    }
    if (!onScreen) {
      let reactGenieState = sharedState as ReactGenieState;
      reactGenieState.navState = {
        objectViewClassName: AllGenieObjectInterfaces.getInterfaces(
          instantiatedDisplayingObject
        ).viewClassName,
        objectConstructorParams:
          allDisplayingObjects.length === 1
            ? allDisplayingObjects[0].value._getConstructorParams()
            : {
                elements: allDisplayingObjects.map((displayingObject) =>
                  displayingObject.value._getConstructorParams()
                ),
              },
      };
      reactGenieState.navStack += 1;
    }

    console.log(`after executing state ${JSON.stringify(sharedState)}`);
  });
}
