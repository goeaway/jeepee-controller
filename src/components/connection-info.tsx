import { Button, CircularProgress } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Connection } from "@src/types";
import React, { useEffect } from "react";
import styled from "styled-components";

export interface ConnectionInfoProps {
    connectionState: Connection;
    retryingIn?: number;
    onRetry?: () => void;
    autoRetryWait?: number;
}

const ConnectionInfo : React.FC<ConnectionInfoProps> = ({connectionState, onRetry, autoRetryWait}) => {
    useEffect(() => {
        if(connectionState === "disconnected" && onRetry && autoRetryWait) {
            setTimeout(() => {  
                onRetry();
            }, autoRetryWait);
        }
    }, [connectionState]);

    return (
        <Container>
            {connectionState === "disconnected" ? <ErrorIcon color="error" /> 
                             : connectionState === "connecting" ? <CircularProgress />
                             : connectionState === "connected" ? <CheckCircleIcon color="primary" />
                             : ""} 
            {connectionState === "disconnected" ? "Not Connected" : 
            connectionState === "connecting" ? "Connecting" : 
            "Connected"}

            {connectionState === "disconnected" && onRetry && (
                <Button onClick={onRetry}>Connect</Button>
            )}
        </Container>
    );
}

export default ConnectionInfo;

const Container = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`