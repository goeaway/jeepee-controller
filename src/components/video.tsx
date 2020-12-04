import React from "react";
import styled from "styled-components";
import Config from "@config";

export interface VideoProps {

}

const Video : React.FC<VideoProps> = () => {

    return (
        <Container>
            <VideoElement show={true} src={`${Config.feedURL}/stream/video.mjpeg`} alt="image"></VideoElement>
        </Container>
    );
}

export default Video;

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: ${p => p.theme.shadows[10]};
`

const ConnectionContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
    color: white;
`

interface VideoElementProps {
    show: boolean;
}

const VideoElement = styled.img`
    display: ${(p: VideoElementProps) => p.show ? "block" : "none"};
    height: 100%;
    background: black;
`