import React, { default as ReactFromImport } from "react";
import { Provider } from "react-redux";
import { StyleSheet, View } from "react-native";
import { reactGenieStore } from "./counterStore";
import { CounterView } from "./CounterView";
import { ModalityProvider, ReactFromModule } from "reactgenie-lib";
import { CounterListView } from "./CounterListView";
import { CounterAltView } from "./CounterAltView";
import ENV from "./config";

console.log("React is ReactFromModule", ReactFromModule === ReactFromImport);

const App = () => {
  return (
    <Provider store={reactGenieStore}>
      <ModalityProvider
        displayTranscript={true}
        codexApiKey={ENV.OPENAI_API_KEY!}
        codexApiBaseUrl={ENV.OPENAI_API_BASE_URL!}
        azureSpeechRegion={ENV.AZURE_SPEECH_REGION!}
        azureSpeechKey={ENV.AZURE_SPEECH_KEY!}
        extraPrompt={
          '// we are using voice recognition. so there may be errors. Try to think about words with similar sounds. For example "address" can actually be "add this".'
        }
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View style={styles.container}>
            <CounterAltView name={"coin"} />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: "40px",
          }}
        >
          <View style={styles.container}>
            <CounterView name={"potato"} />
          </View>
          <div style={styles.container}>
            <CounterView name={"tomato"} />
          </div>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: "40px",
          }}
        >
          <View style={styles.container}>
            <CounterView name={"apple"} />
          </View>
          <View style={styles.container}>
            <CounterView name={"banana"} />
          </View>
          <View style={styles.container}>
            <CounterView name={"orange"} />
          </View>
          <br />
        </View>
        <CounterListView elements={[{ name: "apple" }]} />
      </ModalityProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
