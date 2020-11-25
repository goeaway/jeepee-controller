export interface Command { 
    channel: number, 
    direction: boolean, 
    on: boolean 
}

export type Connection = "disconnected" | "connecting" | "connected";

export enum ControlScheme {
    Keyboard,
    Gamepad,
    Touch
}

export interface Channel {
    id: number;
    name: string;
}

export interface ControllerInfo {
    supportedChannels: Array<Channel>;
    supportedControlSchemes: Array<ControlScheme>;
    sentCommands: Array<Command>;
    connection: Connection;
    updateChannel?: (command: Command) => void;
    disconnectRetry?: () => void;
}

export enum Device {
    desktop,
    mobile
}

export interface UpDownButtonsState {
    up: boolean;
    down: boolean;
}