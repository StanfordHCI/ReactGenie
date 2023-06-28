import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import createSpeechServicesPonyfill from "web-speech-cognitive-services";

export const SpeechRecognizer = (props: {
  shouldListen: boolean;
  speechStatusCallback: (status: boolean, transcript: string) => void;
  speechResultCallback: (result: string) => void;
  azureSpeechRegion: string;
  azureSpeechKey: string;
}) => {
  const { finalTranscript, interimTranscript, resetTranscript } =
    useSpeechRecognition();
  const [speechStatus, setSpeechStatus] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (props.shouldListen !== listening) {
      if (props.shouldListen) {
        SpeechRecognition.startListening({
          continuous: false,
          language: "en-US",
        });
        setListening(true);
      } else {
        SpeechRecognition.stopListening();
        setListening(false);
      }
    }
  }, [props.shouldListen]);

  useEffect(() => {
    // status is true if interimTranscript is not empty
    const newStatus = interimTranscript !== "";
    if (newStatus !== speechStatus) {
      setSpeechStatus(newStatus);
    }
    props.speechStatusCallback(newStatus, interimTranscript);
  }, [interimTranscript]);

  useEffect(() => {
    if (finalTranscript != "") {
      props.speechResultCallback(finalTranscript);
      resetTranscript();
      SpeechRecognition.stopListening();
    }
  }, [finalTranscript]);

  // initialize Azure speech services by creating a ponyfill
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
