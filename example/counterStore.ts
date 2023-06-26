import {Counter} from "./genie/counter";
import {initReactGenie} from "reactgenie-lib"

// make sure Counter is loaded before this is called
console.log(Counter);

export const reactGenieStore = initReactGenie();