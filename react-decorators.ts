// dictionary of genie object names to genie objects
import { GenieViewWrapper } from "./genie-view-wrapper";
import {
  FuncDescriptor,
  GenieClassModifier,
  GenieObject,
  initGenie,
  genieDispatch,
  AllGenieObjects,
  sharedState,
} from "reactgenie-dsl";
import {
  GenieClass,
  GenieFunction,
  GenieKey,
  GenieProperty,
  DataClass,
  HelperClass,
  int,
  float,
  ClassDescriptor,
  FieldDescriptor,
  ParamDescriptor,
} from "reactgenie-dsl";

export {
  GenieClass,
  GenieFunction,
  GenieKey,
  GenieProperty,
  DataClass,
  HelperClass,
  int,
  float,
  ClassDescriptor,
  FieldDescriptor,
  FuncDescriptor,
  ParamDescriptor,
} from "reactgenie-dsl";
import React from "react";
import { ReactGenieState } from "./shared-store";

export { AllGenieObjects } from "reactgenie-dsl";

export interface GenieInterfaceStoreElement {
  objectClassName: string;
  viewClassName: string;
  title: (any) => string;
  function: any;
  displayPriority: (target: any) => number;
}

class GenieInterfacesStore {
  supportedTypes: Set<string> = new Set<string>();
  interfaces: { [key: string]: GenieInterfaceStoreElement[] } = {};

  addInterface(element: GenieInterfaceStoreElement) {
    if (!this.interfaces[element.objectClassName]) {
      this.interfaces[element.objectClassName] = [];
    }
    this.interfaces[element.objectClassName].push(element);
    this.supportedTypes.add(element.objectClassName);
  }

  getObjectClassName(object: GenieObject): string {
    if (object.constructor.name === "Array") {
      return this.getObjectClassName(object[0]) + "[]";
    }
    return object.constructor.name;
  }

  getInterfaces(object: GenieObject): GenieInterfaceStoreElement {
    const className = this.getObjectClassName(object);
    if (this.interfaces[className]) {
      const sortedInterfaces = this.interfaces[className].sort((a, b) => {
        return b.displayPriority(object) - a.displayPriority(object);
      });
      return sortedInterfaces[0];
    }
    return null;
  }

  // key is the class name of the GenieInterfaceStoreElement, not the GenieObject
  allInterfaces(): { [key: string]: GenieInterfaceStoreElement } {
    const allInterfaces: { [key: string]: GenieInterfaceStoreElement } = {};
    for (const key in this.interfaces) {
      for (const element of this.interfaces[key]) {
        allInterfaces[element.viewClassName] = element;
      }
    }
    return allInterfaces;
  }
}

export const AllGenieObjectInterfaces: GenieInterfacesStore =
  new GenieInterfacesStore();

export const AllGenieDisplayedInstances: {
  [key: string]: () => GenieInterfaceSpec;
} = {};

export const ClickPoints: { x: number; y: number }[] = [];

interface GenieObjectSpec {
  className: string;
  key: any;
}

interface GenieRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GenieInterfaceSpec extends GenieObjectSpec {
  rect: GenieRect;
}

export function InstantiateGenieObject(objectSpec: GenieObjectSpec): any {
  const objectClass = AllGenieObjects[objectSpec.className] as typeof DataClass;
  return objectClass.GetObject(objectSpec.key);
}

/**
 * Get all genie class interfaces within modality provider and their rects
 * @returns {GenieInterfaceSpec[]} Retrieve all the Genie object components on the interface and their rects
 */
export function RetrieveInterfaces(): GenieInterfaceSpec[] {
  // scan through values of AllGenieObject and get the displayedInstances
  console.log(
    `AllGenieObjectInterfaces ${JSON.stringify(AllGenieDisplayedInstances)}`
  );
  const displayedInstances: GenieInterfaceSpec[] = [];
  for (const key in AllGenieDisplayedInstances) {
    displayedInstances.push(AllGenieDisplayedInstances[key]());
  }
  return displayedInstances;
}

const reactGenieClassModifier: GenieClassModifier = (target: any) => {
  console.log("ReactGenie Class modifier called on " + target.name);

  // append method `current()` to the class
  /**
   * Retrieves the most relevant instance of GenieObject in this context
   * @returns {any} the GenieObject
   */
  function Current() {
    const currentClassName = target.ClassDescriptor.className;
    const genieInterfaces = RetrieveInterfaces();

    if (ClickPoints.length > 0) {
      // find the genie object that is closest to the click point
      let closest = genieInterfaces[0];
      let closestDistance = Math.sqrt(
        Math.pow(
          ClickPoints[0].x - (closest.rect.x + closest.rect.width / 2),
          2
        ) +
          Math.pow(
            ClickPoints[0].y - (closest.rect.y + closest.rect.height / 2),
            2
          )
      );
      for (let i = 1; i < genieInterfaces.length; i++) {
        if (genieInterfaces[i].className !== currentClassName) continue;
        const distance = Math.sqrt(
          Math.pow(
            ClickPoints[0].x -
              (genieInterfaces[i].rect.x + genieInterfaces[i].rect.width / 2),
            2
          ) +
            Math.pow(
              ClickPoints[0].y -
                (genieInterfaces[i].rect.y +
                  genieInterfaces[i].rect.height / 2),
              2
            )
        );
        if (distance < closestDistance) {
          closest = genieInterfaces[i];
          closestDistance = distance;
        }
      }
      return InstantiateGenieObject(closest);
    } else {
      let result = null;
      let biggestArea = 0;
      console.log(`current called with ${JSON.stringify(genieInterfaces)}`);

      for (const genieInterface of genieInterfaces) {
        if (genieInterface.className !== currentClassName) continue;
        const area = genieInterface.rect.width * genieInterface.rect.height;
        console.log();
        if (area > biggestArea) {
          result = genieInterface;
          biggestArea = area;
        }
      }
      return InstantiateGenieObject(result);
    }
  }

  target.Current = Current;

  // append additional function descriptor to class descriptor
  target.ClassDescriptor.functions.add(
    new FuncDescriptor("Current", [], target.ClassDescriptor.className, true)
  );
};

export function initReactGenie() {
  const reactGenieStore = initGenie({
    initGenieClassModifier: reactGenieClassModifier,
  });
  genieDispatch(() => {
    const reactGenieState = sharedState as ReactGenieState;
    reactGenieState.navState = {
      objectViewClassName: null,
      objectConstructorParams: null,
    };
    reactGenieState.navStack = 0;
    reactGenieState.message = {
      message: "",
      type: "info",
    };
  });
  return reactGenieStore;
}

export function GenieClassInterface(
  title: string | ((any) => string),
  type: string,
  displayPriority: number | ((target: any) => number) = 0
) {
  return function (target: any) {
    console.log("GenieFunction decorator called on " + target.name);
    // create a function with a list of parameters
    const newTarget = (...args) => {
      return GenieViewWrapper(type, target, args)();
    };
    const titleFunction = typeof title === "string" ? () => title : title;
    const displayPriorityFunction =
      typeof displayPriority === "number"
        ? () => displayPriority
        : displayPriority;
    const newGenieInterfaceSpec: GenieInterfaceStoreElement = {
      objectClassName: type,
      viewClassName: target.name,
      title: titleFunction,
      function: newTarget,
      displayPriority: displayPriorityFunction,
    };
    AllGenieObjectInterfaces.addInterface(newGenieInterfaceSpec);
    // add callback function with shared data structure which contains whether the element is on/off screen
    return React.memo(newTarget);
  };
}
