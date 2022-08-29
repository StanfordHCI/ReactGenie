import {Counter} from "./genie/counter";
import {initReactGenie} from "reactgenie"

// make sure Counter is loaded before this is called
console.log(Counter);

export const reactGenieStore = initReactGenie();