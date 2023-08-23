import { GenieInterfaceSpec } from "./react-decorators";
export type ReactGenieState = {
    message: {
        message: string;
        type: string;
    };
    navState: NavigatorState;
    navStack: number;
};
export declare let uiActive: boolean;
export interface NavigatorState {
    objectViewClassName: string | null;
    objectConstructorParams: any;
}
export declare const useGenieCodeSelector: (command: string) => (state: any) => any;
export declare const useGenieSelector: (selector: any) => any;
type GenieCodeResult = {
    success: boolean;
    results: [{
        ast: any;
        result: any;
    }];
};
export declare function executeGenieCode(command: string): GenieCodeResult;
export declare function displayResult(executionResult: GenieCodeResult, transcript: string, parsed: string, genieInterfaces: GenieInterfaceSpec[]): void;
export {};
