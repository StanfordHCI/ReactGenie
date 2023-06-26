import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import React, {useEffect, useState} from "react";
import createSpeechServicesPonyfill from 'web-speech-cognitive-services';

// @ts-ignore
// import createSpeechServicesPonyfill from 'web-speech-cognitive-services';
import {View} from "react-native";

// // TODO: this does not work yet
// export function applyAzureSpeechRecognition(azureSpeechKey: string, azureSpeechRegion: string) {
//     const AzureSpeechRecognition = createSpeechServicesPonyfill({
//         credentials: {
//             region: azureSpeechRegion,
//             subscriptionKey: azureSpeechKey
//         }
//     });
//     SpeechRecognition.applyPolyfill(AzureSpeechRecognition);
// }

const { SpeechRecognition: AzureSpeechRecognition } = createSpeechServicesPonyfill({
  credentials: {
    region: "westus2",
    subscriptionKey: "22c5676933f34b1a89780774f47be557",
  }
});
SpeechRecognition.applyPolyfill(AzureSpeechRecognition);


export const SpeechRecognizer = (props: {
    startListening: boolean,
    speechStatusCallback: (status: boolean, transcript: string) => void
    speechResultCallback: (result: string) => void

}) => {
    const {
        finalTranscript,
        interimTranscript,
        resetTranscript
    } = useSpeechRecognition();
    const [speechStatus, setSpeechStatus] = useState(false);

    useEffect(() => {
        if (props.startListening) {
            SpeechRecognition.startListening({continuous: true, language: 'en-US'});
        }
    }, [props.startListening])

    useEffect( () => {
        // status is true if interimTranscript is not empty
        const newStatus = interimTranscript !== "";
        if (newStatus !== speechStatus) {
            setSpeechStatus(newStatus);
        }
        props.speechStatusCallback(newStatus, interimTranscript);
        console.log(interimTranscript)
    }, [interimTranscript])

    useEffect(() => {
        if (finalTranscript != "") {
            props.speechResultCallback(finalTranscript);
            console.log(finalTranscript)
            resetTranscript();
            SpeechRecognition.stopListening();
            SpeechRecognition.startListening({continuous: true, language: 'en-US'});
        }
    }, [finalTranscript])

    return (
        <View>
        </View>
    );
}
