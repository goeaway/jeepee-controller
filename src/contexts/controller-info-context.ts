import { ControllerInfo, ControlScheme } from "@src/types";
import { createContext } from "react";

const ControllerInfoContext = createContext<ControllerInfo>({
    supportedChannels: [],
    supportedControlSchemes: [ControlScheme.Keyboard],
    sentCommands: [],
    connection: "disconnected"
});

export default ControllerInfoContext;