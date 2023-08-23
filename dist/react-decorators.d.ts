import { GenieObject } from "reactgenie-dsl";
export { GenieClass, GenieFunction, GenieKey, GenieProperty, DataClass, HelperClass, int, float, ClassDescriptor, FieldDescriptor, FuncDescriptor, ParamDescriptor, } from "reactgenie-dsl";
import React from "react";
export { AllGenieObjects } from "reactgenie-dsl";
export interface GenieInterfaceStoreElement {
    objectClassName: string;
    viewClassName: string;
    title: (any: any) => string;
    function: any;
    displayPriority: (target: any) => number;
}
declare class GenieInterfacesStore {
    supportedTypes: Set<string>;
    interfaces: {
        [key: string]: GenieInterfaceStoreElement[];
    };
    addInterface(element: GenieInterfaceStoreElement): void;
    getObjectClassName(object: GenieObject): string;
    getInterfaces(object: GenieObject): GenieInterfaceStoreElement;
    allInterfaces(): {
        [key: string]: GenieInterfaceStoreElement;
    };
}
export declare const AllGenieObjectInterfaces: GenieInterfacesStore;
export declare const AllGenieDisplayedInstances: {
    [key: string]: () => GenieInterfaceSpec;
};
export declare const ClickPoints: {
    x: number;
    y: number;
}[];
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
export declare function InstantiateGenieObject(objectSpec: GenieObjectSpec): any;
export declare function RetrieveInterfaces(): GenieInterfaceSpec[];
export declare function initReactGenie(): import("redux").Store<any, import("redux").AnyAction>;
export declare function GenieClassInterface(type: string, displayTitle?: string | ((any: any) => string) | undefined, displayPriority?: number | ((target: any) => number)): (target: any) => React.MemoExoticComponent<(...args: any[]) => React.JSX.Element>;
