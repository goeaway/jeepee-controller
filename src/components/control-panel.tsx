import { Paper } from "@material-ui/core";
import { ControlScheme, Device } from "@src/types";
import React from "react";
import styled, {css} from "styled-components";
import ChannelInfo from "./channel-info";
import ConnectionInfo from "./connection-info";
import { Keyboard, SportsEsports, TouchApp } from "@material-ui/icons";
import useControllerInfo from "@src/hooks/use-controller-info";
import useDetectDevice from "@src/hooks/use-detect-device";

const ControlPanel = () => {
    const { sentCommands, connection, supportedChannels, supportedControlSchemes, disconnectRetry } = useControllerInfo();
    
    return (
        <div>
            <Container>
                <ConnectionInfo connectionState={connection} autoRetryWait={30000} onRetry={disconnectRetry} />
                {connection === "connected" && (
                    <>
                        <ChannelContainer>
                            {supportedChannels.map((sc, i) => {
                                const currentCommand = sentCommands.last(sent => sent.channel === sc.id) || { channel: sc.id, direction: false, on: false };
                                return (
                                    <ChannelInfo key={i} on={currentCommand.on} channelId={sc.id} channelName={sc.name} direction={currentCommand.direction} />
                                    )
                                })}
                        </ChannelContainer>
                        <ControlSchemesContainer>
                            <ControlIconContainer isOn={supportedControlSchemes.some(sc => sc === ControlScheme.Keyboard)}>
                                <Keyboard fontSize="large" />
                            </ControlIconContainer>
                            <ControlIconContainer isOn={supportedControlSchemes.some(sc => sc === ControlScheme.Gamepad)}>
                                <SportsEsports fontSize="large" />
                            </ControlIconContainer>
                            <ControlIconContainer isOn={supportedControlSchemes.some(sc => sc === ControlScheme.Touch)}>
                                <TouchApp />
                            </ControlIconContainer>
                        </ControlSchemesContainer>
                    </>
                )}
            </Container>
        </div>
    )
}

export default ControlPanel;

const PaddedMarginedPaper = styled(Paper)`
    padding: 1rem;
    margin-bottom: 1rem;
`

const Container = styled(PaddedMarginedPaper)`
    display: flex;
    align-items: center;
    flex-direction: column;
`

const ControlSchemesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
`

interface ControlIconContainerProps {
    isOn: boolean;
}

const ControlIconContainer = styled.span`
    ${(p: ControlIconContainerProps) => !p.isOn && css`
        opacity: .4;
    `}
    transition: opacity 300ms;
`

const ChannelContainer = styled.div`
    display: flex;
    align-items:center;
    
    @media(min-width:1000px) {
        flex-direction: column;
    }
`