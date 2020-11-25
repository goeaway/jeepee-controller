import { ArrowUpward, ArrowDownward, FiberManualRecord } from "@material-ui/icons";
import useControllerInfo from "@src/hooks/use-controller-info";
import useDetectDevice from "@src/hooks/use-detect-device";
import { Device, UpDownButtonsState } from "@src/types";
import React from "react";
import styled, { css } from "styled-components";
import UpDownButtons from "./up-down-buttons";

export interface ChannelInfoProps {
    channelId: number;
    direction: boolean;
    on: boolean;
    channelName: string;
}

const ChannelInfo : React.FC<ChannelInfoProps> = ({channelId, direction, on, channelName}) => {
    const deviceType = useDetectDevice();
    const { updateChannel } = useControllerInfo();

    const handleTouchButtonsStateChange = (state: UpDownButtonsState) => {
        if(updateChannel) {
            updateChannel({channel: channelId, direction: state.down, on: state.up || state.down});
        }
    }

    return (
        <OuterContainer>
            <Container isOn={on}>
                <LabelContainer>
                    <ChannelLabel>Channel</ChannelLabel>
                    {on ? direction ? (<ArrowDownward />) : (<ArrowUpward />) : <FiberManualRecord fontSize="small" />}
                </LabelContainer>
                <ChannelID>{channelName || channelId.toString().padStart(2, "0")}</ChannelID>
            </Container>
            {deviceType === Device.mobile && (
                <UpDownButtons onStateChange={handleTouchButtonsStateChange} />
            )}
        </OuterContainer>
    );
}

export default ChannelInfo;

const LabelContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-right: .2rem;
`

const ChannelLabel = styled.label`
    font-size: 12px;
`

const ChannelID = styled.div`
    font-size: 70px;
`



interface ContainerProps {
    isOn: boolean;
}

const Container = styled.div`
    ${(p: ContainerProps) => !p.isOn && css`
        opacity: .4;
    `}
    transition: opacity 150ms ease;
    display: flex;
    align-items: center;
`

const OuterContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    gap: 10px;

    &:first-child {
        flex-direction: row-reverse;
    }

    @media(min-width:1000px) {
        &:first-child {
            flex-direction: row;
        }
    }
`