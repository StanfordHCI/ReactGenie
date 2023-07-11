import React, { default as ReactFromImport } from "react";
import { default as ReactReduxFromImport, Provider } from "react-redux";
import { StyleSheet, View } from "react-native";
import { reactGenieStore } from "./store";
// import { CounterView } from "./CounterView";
import {
  ModalityProvider,
  ReactFromModule,
  ReactReduxFromModule,
} from "reactgenie-lib";
// import { CounterExamples } from "./genie/DataTemp";
// import { CounterListView } from "./CounterListView";
import { DataView } from "./src/DataView";
import ENV from "./config";
import { DataTempExamples } from "./genie/DataTemp";

console.log("React is ReactFromModule", ReactFromModule === ReactFromImport);
console.log(
  "ReactRedux is ReactReduxFromModule: ",
  ReactReduxFromImport === ReactReduxFromModule
);


const App = () => {
  return (
    <Provider store={reactGenieStore}>
      <ModalityProvider
        examples={DataTempExamples}
        displayTranscript={true}
        codexApiKey={ENV.OPENAI_API_KEY!}
        codexApiBaseUrl={ENV.OPENAI_API_BASE_URL!}
        azureSpeechRegion={ENV.AZURE_SPEECH_REGION!}
        azureSpeechKey={ENV.AZURE_SPEECH_KEY!}
        extraPrompt={
          '// we are using voice recognition. so there may be errors. Try to think about words with similar sounds. For example "address" can actually be "add this".'
        }
      >
        <View style={styles.container}>
            <DataView id={"1"} />
          </View>
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
