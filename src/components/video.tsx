import { Snackbar } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ConnectionInfo from "./connection-info";
import { Connection } from "@src/types";
import Config from "@config";

export interface VideoProps {

}

const Video : React.FC<VideoProps> = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const socket = useRef<WebSocket>(null);
    const peerConnection = useRef<RTCPeerConnection>(null);

    const [message, setMessage] = useState("");
    const [connection, setConnection] = useState<Connection>("disconnected");
    const [tryConnect, setTryConnect] = useState(false);

    // useEffect(() => {
    //     if(tryConnect) {
    //         socket.current = new WebSocket(`${Config.feedURL}/stream/webrtc`);
    //         setConnection("connecting");
            
    //         socket.current.onopen = () => {
    //             /* First we create a peer connection */
    //             var config = {"iceServers": [{"urls": [Config.stunURL]}]};
    //             peerConnection.current = new RTCPeerConnection(config);
                
    //             peerConnection.current.onicecandidate = function (event) {
    //                 if (event.candidate && event.candidate && event.candidate.candidate.length > 0) { // these checks very important for FF apparently
    //                     var candidate = {
    //                         sdpMLineIndex: event.candidate.sdpMLineIndex,
    //                         sdpMid: event.candidate.sdpMid,
    //                         candidate: event.candidate.candidate
    //                     };
    //                     var request = {
    //                         what: "addIceCandidate",
    //                         data: JSON.stringify(candidate)
    //                     };
    //                     socket.current.send(JSON.stringify(request));
    //                 } else {
    //                     console.log("end of candidates.");
    //                 }
    //             };
                
    //             peerConnection.current.ontrack = function (event) {
    //                 setConnection("connected");
    //                 videoRef.current.srcObject = event.streams[0];
    //                 videoRef.current.play();
    //             };
                
    //             /* kindly signal the remote peer that we would like to initiate a call */
    //             const request = {
    //                 what: "call",
    //                 options: {
    //                     force_hw_vcodec: false,
    //                     vformat: 60, 
    //                     trickle_ice: true
    //                 }
    //             };
                
    //             socket.current.send(JSON.stringify(request));
    //         };
            
    //         socket.current.onmessage = (ev: MessageEvent<any>) => {
    //             const { what, data } = JSON.parse(ev.data);
    //             switch(what) {
    //                 case "offer":
    //                     peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(data)))
    //                     .then(() => {
    //                         peerConnection.current.createAnswer({ offerToReceiveVideo: true })
    //                         .then(desc => {
    //                             peerConnection.current.setLocalDescription(desc);
    //                             const request = {
    //                                 what: "answer",
    //                                 data: JSON.stringify(desc)
    //                             };
    //                             socket.current.send(JSON.stringify(request));
    //                         });
    //                     })
    //                     .catch((err) => {
    //                         socket.current.close();
    //                     });
    //                     break;
    //                 case "message":
    //                     // handle error
    //                     setMessage(data);
    //                     setConnection("disconnected");
    //                     setTryConnect(false);
    //                     break;
    //                 case "iceCandidate":
    //                     if(!data) {
    //                         break;
    //                     }
                        
    //                     const elt = JSON.parse(data);
    //                     const candidate = new RTCIceCandidate({sdpMLineIndex: elt.sdpMLineIndex, candidate: elt.candidate});
    //                     peerConnection.current.addIceCandidate(candidate);
    //                     break;
    //                 case "iceCandidates":
    //                     break;
    //             }
    //         }
                        
    //         socket.current.onclose = (ev: CloseEvent) => {
    //             if(peerConnection.current) {
    //                 peerConnection.current.close();
    //             }
    //             setConnection("disconnected");
    //             setTryConnect(false);
    //         }

    //         return () => {
    //             socket.current.send(JSON.stringify({ what: "hangup"}));
    //         }
    //     }
    // }, [tryConnect]);

    // const onRetryHandler = () => {
    //     setTryConnect(true);
    // }
                        
    return (
        <Container>
            <ConnectionContainer>
                <ConnectionInfo connectionState={connection} />
            </ConnectionContainer>
            
            <VideoElement show={true} src={`${Config.feedURL}/stream/video.mjpeg`} alt="image"></VideoElement>
            {/* <VideoElement show={connection === "connected"} autoPlay playsInline ref={videoRef} /> */}
            <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "left"}} open={!!message} message={message} autoHideDuration={6000} onClose={() => setMessage("")} />
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