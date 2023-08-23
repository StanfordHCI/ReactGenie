import React from "react";
import { NlInterpreter, ExampleParse } from "reactgenie-dsl";
export declare let GenieInterpreter: NlInterpreter;
export declare const enum ListenerStateEnum {
    Idle = 0,
    Listening = 1,
    Processing = 2
}
export declare const ModalityProvider: (props: {
    examples?: ExampleParse[];
    codexApiKey: string;
    codexApiBaseUrl: string;
    azureSpeechRegion: string;
    azureSpeechKey: string;
    displayTranscript: boolean;
    extraPrompt: string;
    children: React.ReactElement[] | React.ReactElement;
}) => React.JSX.Element;
