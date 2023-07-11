
import {
  GenieClass,
  GenieFunction,
  GenieProperty,
  HelperClass,
} from "reactgenie-lib";
import "reflect-metadata";

@GenieClass("A template for HelperClass")
export class HelperTemp extends HelperClass {
  @GenieProperty()
  public name: string;
  @GenieProperty()
  public content: string;


  constructor({name = undefined, content = undefined}: {name?: string; content?: string}) {
    super({});
    this.name = "";
    this.content = "";
  }

  @GenieFunction()
  static fromString({name, content}:{name:string, content:string}) : HelperTemp
  {
    const ht = HelperTemp.CreateObject({});
    ht.name = name;
    ht.content = content;
    return ht;

  }

  static setup() {}

}

export const HelperTempExamples = [
];
