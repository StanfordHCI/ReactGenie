import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import createSpeechServicesPonyfill from "web-speech-cognitive-services";

export const SpeechRecognizer = (props: {
  startListening: boolean;
  speechStatusCallback: (status: boolean, transcript: string) => void;
  speechResultCallback: (result: string) => void;
  azureSpeechRegion: string;
  azureSpeechKey: string;
}) => {
  const { finalTranscript, interimTranscript, resetTranscript } =
    useSpeechRecognition();
  const [speechStatus, setSpeechStatus] = useState(false);

  useEffect(() => {
    if (props.startListening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  }, [props.startListening]);

  useEffect(() => {
    // status is true if interimTranscript is not empty
    const newStatus = interimTranscript !== "";
    if (newStatus !== speechStatus) {
      setSpeechStatus(newStatus);
    }
    props.speechStatusCallback(newStatus, interimTranscript);
    console.log(interimTranscript);
  }, [interimTranscript]);

  useEffect(() => {
    if (finalTranscript != "") {
      props.speechResultCallback(finalTranscript);
      console.log(finalTranscript);
      resetTranscript();
      SpeechRecognition.stopListening();
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  }, [finalTranscript]);

  useEffect(() => {
    const { SpeechRecognition: AzureSpeechRecognition } =
      createSpeechServicesPonyfill({
        credentials: {
          region: props.azureSpeechRegion,
          subscriptionKey: props.azureSpeechKey,
        },
      });
    SpeechRecognition.applyPolyfill(AzureSpeechRecognition);
  }, []);

  return <View></View>;
};
