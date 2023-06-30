import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
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
  NavigatorState,
} from "./shared-store";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Stack = createStackNavigator();
export let GenieInterpreter: NlInterpreter;

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
    // FIXME
    const title = genieInterfaceStoreElement.title(route.params);
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

export const enum ListenerStateEnum {
  Idle,
  Listening,
  Processing,
  // Done,
}

export const ModalityProvider = (props: {
  examples: ExampleParse[];
  codexApiKey: string;
  codexApiBaseUrl: string;
  azureSpeechRegion: string;
  azureSpeechKey: string;
  displayTranscript: boolean;
  extraPrompt: string;
  children: React.ReactElement[] | React.ReactElement;
}) => {
  const navState: NavigatorState = useSelector((state: any) => {
    return state.navState;
  });

  const navStack = useSelector((state: any) => {
    return state.navStack;
  });

  const voiceMessage = useSelector((state: any) => {
    return state.message;
  });

  const [snackbarVisible, setSnackbarVisible] = useState(false);

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

  const [listenerState, setListenerState] = useState(ListenerStateEnum.Idle);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    console.log("listener state changed", listenerState);
  }, [listenerState]);

  const handleClick = (event) => {
    if (listenerState === ListenerStateEnum.Listening) {
      const x = event.clientX;
      const y = event.clientY;
      console.log(`Click position: (${x}, ${y})`);
      ClickPoints.push({ x: x, y: y });
    }
    setMouseDown(false);
  };
  const handleDown = () => {
    setMouseDown(true);
  };

  const speechStatusCallback = (status, interimTranscript) => {
    if (listenerState === ListenerStateEnum.Listening) {
      console.log(`Speech status: ${status}`);
      if (status == true) {
        console.log(`Interim transcript: ${interimTranscript}`);
        setInterimTranscript(interimTranscript);
      }
    }
  };
  const speechResultCallback = (finalTranscript) => {
    if (listenerState === ListenerStateEnum.Listening) {
      console.log(`Final transcript: ${finalTranscript}`);
      setInterimTranscript(finalTranscript);
      setTranscript(finalTranscript);
    }
  };

  let lastTranscript = "";

  useEffect(() => {
    if (transcript !== "" && listenerState === ListenerStateEnum.Listening) {
      lastTranscript = transcript;
      RetrieveInterfaces();
      setListenerState(ListenerStateEnum.Processing);
      setTranscript("");
      GenieInterpreter.nlParser.parse(lastTranscript).then((result) => {
        console.log(`parsed result: ${result}`);
        setInterimTranscript("");
        setListenerState(ListenerStateEnum.Idle);
        const executionResult = executeGenieCode(result);

        if (executionResult.success) {
          displayResult(executionResult, lastTranscript, result);
        }
        ClickPoints.splice(0, ClickPoints.length);
      });
    }
  }, [transcript]);

  return (
    <View style={{ flex: 1 }}>
      {(listenerState === ListenerStateEnum.Listening ||
        listenerState === ListenerStateEnum.Processing) && (
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
          {listenerState === ListenerStateEnum.Processing && (
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
            if (listenerState === ListenerStateEnum.Idle) {
              setListenerState(ListenerStateEnum.Listening);
            }
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor:
                listenerState === ListenerStateEnum.Listening
                  ? "#0000ff"
                  : "#cccccc",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="microphone" size={30} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </div>
      <SpeechRecognizer
        speechStatusCallback={speechStatusCallback}
        speechResultCallback={speechResultCallback}
        shouldListen={listenerState === ListenerStateEnum.Listening}
        azureSpeechRegion={props.azureSpeechRegion}
        azureSpeechKey={props.azureSpeechKey}
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
