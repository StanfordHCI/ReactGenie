import React from "react";
export declare const SpeechRecognizer: (props: {
    shouldListen: boolean;
    speechStatusCallback: (status: boolean, transcript: string) => void;
    speechResultCallback: (result: string) => void;
    azureSpeechRegion: string;
    azureSpeechKey: string;
}) => React.JSX.Element;
