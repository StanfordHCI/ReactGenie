import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavigationContainer,
  StackActions,
  useNavigationContainerRef,
} from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { SpeechRecognizer } from "./speech-recognition";
import { Snackbar } from "@react-native-material/core";

import {
  NlInterpreter,
  ClassDescriptor,
  ExampleParse,
  GenieObject,
} from "reactgenie-dsl";
import {
  AllGenieObjectInterfaces,
  AllGenieObjects,
  ClickPoints,
  GenieInterfaceStoreElement,
  RetrieveInterfaces,
} from "./react-decorators";
import {
  displayResult,
  executeGenieCode,
  genieCommandSuccess,
  NavigatorState,
} from "./shared-store";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Stack = createStackNavigator();
export let GenieInterpreter: NlInterpreter;

let lastTranscript = "";

const DefaultScreen =
  (children) =>
  ({ navigation }) => {
    useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, []);
    return children;
  };

const ObjectInterfaceScreen =
  (genieInterfaceStoreElement: GenieInterfaceStoreElement) =>
  ({ route, navigation }) => {
    let title: string;
    title = genieInterfaceStoreElement.title(route.params);
    useEffect(() => {
      navigation.setOptions({ headerShown: true });
      navigation.setOptions({ title: title });
    }, []);
    return <genieInterfaceStoreElement.function {...route.params} />;
  };

const cardStyle: StackNavigationOptions = {
  presentation: "card",
  animationEnabled: true,
  headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export const ModalityProvider = (props: {
  examples: ExampleParse[];
  codexApiKey: string;
  codexApiBaseUrl: string;
  azureSpeechRegion: string;
  azureSpeechKey: string;
  displayTranscript: boolean;
  autoStart: boolean;
  extraPrompt: string;
  children: React.ReactElement[] | React.ReactElement;
}) => {
  const navState: NavigatorState = useSelector((state: any) => {
    return state.navState;
  });

  const navStack = useSelector((state: any) => {
    return state.navStack;
  });

  const recentVoiceCommand = useSelector((state: any) => {
    return state.command;
  });

  const voiceMessage = useSelector((state: any) => {
    return state.message;
  });

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [startListening, setStartListening] = useState(props.autoStart);

  useEffect(() => {
    if (
      voiceMessage !== null &&
      voiceMessage !== undefined &&
      voiceMessage.message != ""
    ) {
      setSnackbarVisible(true);
      setTimeout(() => {
        setSnackbarVisible(false);
      }, 3000);
    }
  }, [voiceMessage]);

  GenieInterpreter = useMemo(() => {
    const descriptors: ClassDescriptor<GenieObject>[] = [];
    for (const key in AllGenieObjects) {
      descriptors.push(AllGenieObjects[key].ClassDescriptor);
    }
    return new NlInterpreter(
      descriptors,
      props.codexApiKey,
      undefined,
      props.examples,
      props.extraPrompt,
      props.codexApiBaseUrl
    );
  }, [props.codexApiKey, props.examples]);

  //create ref to NavigationContainer with type
  const navigationRef = useNavigationContainerRef();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("nav state changed", navState);
    if (navState.objectViewClassName !== null) {
      navigationRef.dispatch(
        StackActions.push(
          navState.objectViewClassName,
          navState.objectConstructorParams
        )
      );
    }
  }, [navStack]);

  const uiList = useMemo(() => {
    const uiList = [];
    const allInterfaces = AllGenieObjectInterfaces.allInterfaces();
    for (const key in allInterfaces) {
      const interfacesStoreElement = allInterfaces[key];
      uiList.push(
        <Stack.Screen
          key={key}
          name={key}
          component={ObjectInterfaceScreen(interfacesStoreElement)}
          options={cardStyle}
        />
      );
    }
    return uiList;
  }, []);

  const gui = useMemo(
    () => (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={"Default GUI"}>
          <Stack.Screen
            name={"Default GUI"}
            key={"Default GUI"}
            component={DefaultScreen(props.children)}
            options={cardStyle}
          />
          {uiList}
        </Stack.Navigator>
      </NavigationContainer>
    ),
    []
  );

  const [activeVoice, setActiveVoice] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [mouseDown, setMouseDown] = useState(false);
  const [processing, setProcessing] = useState(false);
  const handleClick = (event) => {
    console.log(listening);
    if (listening || activeVoice) {
      const x = event.clientX;
      const y = event.clientY;
      console.log(`Click position: (${x}, ${y})`);
      ClickPoints.push({ x: x, y: y });
    }
    setMouseDown(false);
  };

  const handleDown = () => {
    console.log(listening);
    setMouseDown(true);
  };

  const speechStatusCallback = (status, interimTranscript) => {
    if (props.autoStart || activeVoice) {
      console.log(`Speech status: ${status}`);
      if (status == true) {
        setListening(status);
        console.log(`Interim transcript: ${interimTranscript}`);
        setInterimTranscript(interimTranscript);
      }
    }
  };
  const speechResultCallback = (finalTranscript) => {
    if (props.autoStart || activeVoice) {
      setListening(finalTranscript);
      setListening(false);
      console.log(`Final transcript: ${finalTranscript}`);
      setInterimTranscript(finalTranscript);
      setTranscript(finalTranscript);
    }
  };

  useEffect(() => {
    setProcessing(false);
    // navigator.mediaDevices.getUserMedia({audio: true})
    // const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // const recognition = new speechRecognition();
    // recognition.onspeechstart = () => {
    //     recognition.abort();
    // }
    // recognition.start();
  }, []);

  useEffect(() => {
    if (transcript !== "" && (props.autoStart || activeVoice)) {
      RetrieveInterfaces();
      setProcessing(true);
      if (!props.autoStart) {
        setActiveVoice(false);
      }
      console.log(`user uttered: ${transcript}`);
      lastTranscript = transcript;
      GenieInterpreter.nlParser.parse(transcript).then(function (result) {
        console.log(`parsed result: ${result}`);
        console.log(`ClickPoints: ${ClickPoints}`);
        setInterimTranscript("");
        setProcessing(false);
        let executionResult = executeGenieCode(result);
        if (genieCommandSuccess) {
          displayResult(executionResult);
        }
        ClickPoints.splice(0, ClickPoints.length);
      });
    }
  }, [transcript]);

  useEffect(() => {
    // not equal to null or undefined
    if (
      recentVoiceCommand !== null &&
      recentVoiceCommand !== undefined &&
      recentVoiceCommand.command !== ""
    ) {
      GenieInterpreter.nlParser
        .respond(
          lastTranscript,
          recentVoiceCommand.command,
          recentVoiceCommand.result
        )
        .then(function (result) {
          console.log(`respond result: ${result}`);
          if (result !== null) {
            dispatch({ type: "genie/response", payload: result });
          }
        });
    }
  }, [recentVoiceCommand]);

  // @ts-ignore
  return (
    <View style={{ flex: 1 }}>
      {((props.autoStart && listening) || processing || activeVoice) && (
        <div
          onMouseDown={handleDown}
          onClick={handleClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: mouseDown ? "#7f7f7f" : "#cccccc",
            width: "100%",
            height: "100%",
            zIndex: 3,
            opacity: 0.5,
          }}
        >
          {processing && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#ffffff",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 0 10px #000000",
              }}
            >
              <ActivityIndicator size="large" color="#888888" />
            </div>
          )}
          {/*draw transcript at the bottom center of the page, like a subtitle*/}
          {props.displayTranscript && (
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#ffffff",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 0 10px #000000",
                fontSize: "20px",
              }}
            >
              {interimTranscript}
            </div>
          )}
        </div>
      )}
      {!props.autoStart && (
        <div
          style={{
            position: "fixed",
            bottom: "50px",
            right: "10px",
            zIndex: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setStartListening(true);
              if (activeVoice) {
                setActiveVoice(false);
                setProcessing(false);
              } else {
                setActiveVoice(true);
                setProcessing(false);
              }
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: activeVoice ? "#0000ff" : "#cccccc",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="microphone" size={30} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </div>
      )}
      <SpeechRecognizer
        speechStatusCallback={speechStatusCallback}
        speechResultCallback={speechResultCallback}
        startListening={startListening}
      />
      {gui}
      {snackbarVisible && (
        <Snackbar
          message={voiceMessage.message}
          style={{
            position: "absolute",
            start: 16,
            end: 16,
            bottom: 100,
            backgroundColor:
              voiceMessage.type === "error" ? "#ff0000" : "#000000",
          }}
        />
      )}
    </View>
  );
};
