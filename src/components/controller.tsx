import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { Channel, Command, Connection, ControlScheme, Device } from "@src/types";
import React, { useEffect, useState } from "react";
import Config from "@config";
import ControllerInfoContext from "@src/contexts/controller-info-context";
import useDetectDevice from "@src/hooks/use-detect-device";

const Controller: React.FC = ({children}) => {
    const [connection, setConnection] = useState<HubConnection>(null);
    const [sentCommands, setSentCommands] = useState<Array<Command>>([]);
    const [supportedChannels, setSupportedChannels] = useState<Array<Channel>>([]);
    const [controllerConnection, setControllerConnection] = useState<Connection>("connecting");
    const [gamepadConnected, setGamepadConnected] = useState(false);
    const [gamepadCurrentCommands, setGamepadCurrentCommands] = useState<Array<Command>>([]);
    const deviceType = useDetectDevice();

    useEffect(() => {
        if(connection) {
            const getChannels = () => {
                // get channel info from receiver
                fetch(`${Config.receiverURL}/channel/getchannels`)
                .then(response => {
                    if(response.ok) {
                        response.json().then(data => setSupportedChannels(data));
                    }
                })
                .finally(() => {
                    setControllerConnection("connected")
                });
            }

            const start = async () => {
                connection.on("set", (data: Command) => {
                    setSentCommands(c => [...c, data]);
                });

                connection.onclose(err => {
                    setControllerConnection("disconnected");
                });

                connection.onreconnected(() => {
                    getChannels();
                });

                connection.onreconnecting(err => {
                    setControllerConnection("connecting");
                });

                await connection.start();
                getChannels();                
            }

            start();

            const stop = async () => {
                if(connection.state === HubConnectionState.Connected) {
                    await connection.stop();
                }
            }

            return stop;
        }
    }, [connection]);

    useEffect(() => {
        const keypress = (e: any) => {
            if(e.repeat) {
                return;
            }

            const { keyCode: code } = e;
            let command: Command;

            switch(code) {
                case 103: // num 7
                    command = { channel: 0, direction: false, on: true };
                    break;
                case 105: // num 9
                    command = { channel: 1, direction: false, on: true };
                    break;
                case 97: // num 1
                    command = { channel: 0, direction: true, on: true };
                    break;
                case 99: // num 3
                    command = { channel: 1, direction: true, on: true };
                    break;
            }

            if(command) {
                send(command);
            }
        };

        const keyup = (e: any) => {
            if(e.repeat) {
                return;
            }

            const { keyCode: code } = e;
            let command: Command;

            switch(code) {
                case 103: // num 7
                    command = { channel: 0, direction: false, on: false };
                    break;
                case 105: // num 9
                    command = { channel: 1, direction: false, on: false };
                    break;
                case 97: // num 1
                    command = { channel: 0, direction: true, on: false };
                    break;
                case 99: // num 3
                    command = { channel: 1, direction: true, on: false };
                    break;
            }

            if(command) {
                send(command);
            }
        };

        window.addEventListener("gamepadconnected", (e) => {
            setGamepadConnected(navigator.getGamepads().length > 0);
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            setGamepadConnected(false);
        });

        window.addEventListener("keydown", keypress);
        window.addEventListener("keyup", keyup);

        return () => {
            window.removeEventListener("keydown", keypress);
            window.removeEventListener("keyup", keyup);
        }
    }, [connection]);

    // create an event loop to listen for gamepad control while it's connected
    useEffect(() => {
        if(gamepadConnected) {
            if(navigator.getGamepads().length === 0) {
                console.error("A gamepad was detected but could not be found in the navigator. Gamepad events will not be handled.");
            }

            // poll gamepad state
            const interval = setInterval(() => {
                // check gamepad state, if L stick is up/down enough, send command
                // if R stick is up/down enough, send command
                const gamepad = navigator.getGamepads()[0];

                if(!gamepad) {
                    return;
                }

                // extract stick Y values from axes
                const lY = gamepad.axes[1];
                const rY = gamepad.axes[3];

                // if Y value is less than -0.1 the stick is "up" and therefore send an on command for given stick => channel in a direction
                // if Y value is more than 0.1 the stick is "down" and therefore send an on command for given stick => channel in a direction
                // if Y value is between -0.1 and 0.1 we send an off command
                const buffer = 0.3;

                const lSendOn = lY < -buffer || lY > buffer;
                const rSendOn = rY < -buffer || rY > buffer;

                const lSendUp = lY < 0;
                const rSendUp = rY < 0;

                const lCommand = { channel: 0, direction: !lSendUp, on: lSendOn };
                const rCommand = { channel: 1, direction: !rSendUp, on: rSendOn };
                // we don't want to keep sending the same command over and over
                if(!gamepadCurrentCommands.some(cc => cc.channel === lCommand.channel && cc.direction === lCommand.direction && cc.on === lCommand.on)) {
                    send(lCommand);
                    // store this last command and drop any existing commands related to this channel
                    setGamepadCurrentCommands(cc => [...cc.filter(c => c.channel !== lCommand.channel), lCommand]);
                }

                if(!gamepadCurrentCommands.some(cc => cc.channel === rCommand.channel && cc.direction === rCommand.direction && cc.on === rCommand.on)) {
                    send(rCommand);
                    // store this last command and drop any existing commands related to this channel
                    setGamepadCurrentCommands(cc => [...cc.filter(c => c.channel !== rCommand.channel), rCommand]);
                }
            }, 50);

            return () => {
                clearInterval(interval);
            }
        }
    }, [gamepadConnected, gamepadCurrentCommands]);

    const send = async (data: Command) => {
        if(connection && connection.state === HubConnectionState.Connected) {
            await connection.invoke("set", data);
        }
    }

    useEffect(() => {
        // set up signalr functionality
        setConnection(new HubConnectionBuilder()
            .withUrl(`${Config.receiverURL}/jeepeehub`)
            .withAutomaticReconnect()
            .build());
    }, []);

    const supportedControls = () => {
        const def = [];

        if(gamepadConnected) {
            def.push(ControlScheme.Gamepad)
        }

        if(deviceType === Device.desktop) {
            def.push(ControlScheme.Keyboard);
        }
        else if(deviceType === Device.mobile) {
            def.push(ControlScheme.Touch);
        }

        return def;
    };
    
    return (
        <ControllerInfoContext.Provider value={{
            sentCommands,
            connection: controllerConnection,
            supportedControlSchemes: supportedControls(),
            supportedChannels,
            updateChannel: send,
        }}>
            {children}
        </ControllerInfoContext.Provider>
    );
}

export default Controller;