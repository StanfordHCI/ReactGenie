import { DataTemp } from "../genie/DataTemp";
import React from "react";
import {GenieClassInterface} from "reactgenie-lib"
import {useGenieSelector, genieDispatch} from "reactgenie-lib";

const DataViewImpl = (props: { name: string}) => {
    const datatemp: DataTemp = useGenieSelector(() => {
        return DataTemp.GetObject(props);
    });
    const datatempID = useGenieSelector(() => {
        return datatemp.id;
    });
    const datatempContent = useGenieSelector(() => {
        return datatemp.content;
    });
    const helptempName = useGenieSelector(() => {
        return datatemp.helperTemp.name;
    });
    const helptempContent = useGenieSelector(() => {
        return datatemp.helperTemp.content;
    });

    return (
        <div>
            <label>{datatempID}</label> <br/> <label>{datatempContent}</label> 
            <label> {helptempName}</label> <br/> <label>{helptempContent}</label>
        </div>
    )
}


export const DataView = GenieClassInterface((dataTemp: DataTemp) => `${dataTemp.id} DataTemp`, "DataTemp", 1)(DataViewImpl)
