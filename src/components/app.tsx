import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import React from "react";
import { ThemeProvider } from "styled-components";
import Controller from "./controller";
import Video from "./video";
import styled, {css} from "styled-components";
import ControlPanel from "./control-panel";

const App = () => {
    const theme = createMuiTheme({
        palette: {
            type: "dark"
        }
    });

    return (
        <MuiThemeProvider theme={theme}>
            <ThemeProvider theme={theme}>
                <Container>
                    <Controller>
                        <Video />
                        <ControlPanel />
                    </Controller>
                </Container>
            </ThemeProvider>
        </MuiThemeProvider>
    );
}

export default App;

const Container = styled.div`
    display: grid;
    padding: 1rem;
    height: 100vh;
    grid-gap: 20px;
    grid-template-rows: auto 30%;
    background: ${p => p.theme.palette.background.default};
    position: relative;
    overflow: auto;
    
    @media(min-width:1000px) {
        grid-template-columns: auto 20%;
        grid-template-rows: auto;
    }
`