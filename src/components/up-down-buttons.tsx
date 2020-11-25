import { Button } from "@material-ui/core";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { UpDownButtonsState } from "@src/types";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

export interface UpDownButtonsProps {
    onStateChange: (state: UpDownButtonsState) => void;
}

const UpDownButtons: FC<UpDownButtonsProps> = ({onStateChange}) => {
    const [buttonPressedState, setButtonPressedState] = useState<UpDownButtonsState>({up: false, down: false});

    useEffect(() => {
        onStateChange(buttonPressedState);
    }, [buttonPressedState]);

    const upTouchStartHandler = () => {
        setButtonPressedState(s => ({up: true, down: s.down}));
    }

    const upTouchEndHandler = () => {
        setButtonPressedState(s => ({up: false, down: s.down}));
    }

    const downTouchStartHandler = () => {
        setButtonPressedState(s => ({up: s.up, down: true}));
    }

    const downTouchEndHandler = () => {
        setButtonPressedState(s => ({up: s.up, down: false}));
    }

    return (
        <Container>
            <Button type="button" onTouchStart={upTouchStartHandler} onTouchEnd={upTouchEndHandler}><ArrowUpward fontSize="large" /></Button>
            <Button type="button" onTouchStart={downTouchStartHandler} onTouchEnd={downTouchEndHandler}><ArrowDownward fontSize="large" /></Button>
        </Container>
    );
}

export default UpDownButtons;

const Container = styled.div`
    display: flex;
    flex-direction: column;
`