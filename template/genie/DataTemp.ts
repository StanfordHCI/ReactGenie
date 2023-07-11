
import {
  GenieKey,
  GenieClass,
  GenieFunction,
  GenieProperty,
  DataClass,
  float,
} from "reactgenie-lib";
import "reflect-metadata";
import {HelperTemp} from "./HelperTemp"

@GenieClass("A template for DataClass")
export class DataTemp extends DataClass {
  @GenieKey
  @GenieProperty()
  public id: string;
  @GenieProperty()
  public content: string;
  @GenieProperty()
  public helperTemp: HelperTemp;


  constructor({id, content, helperTemp}: {id: string; content: string; helperTemp: HelperTemp}) {
    super({});
    this.id = id;
    this.content = content.toLowerCase();
    this.helperTemp = helperTemp;
  }

  @GenieProperty()
  static Version: float = 1.0;

  static setup() {

    DataTemp.CreateObject({ id: "1", content: "DataClass Template", 
    helperTemp: HelperTemp.fromString({name: "HelperTemp", content:"HelperClass Template"})});
  }


  @GenieFunction()
  static GetDataTemp({id = ""}: {id?: string}): DataTemp {
      return DataTemp.GetObject({id: id});
  }
}

export const DataTempExamples = [
  {
    user_utterance: "current data id",
    example_parsed: "DataTemp.Current().id",
  },
  
];
