import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import "styled-components";
import { Color, Theme } from "@material-ui/core";
import "./utils/extends-array";

const root = document.getElementById("root");

ReactDOM.render(<App />, root);

declare module "@material-ui/core/styles/createPalette" {
    interface Palette {
        thing?: Color;
    }

    interface PaletteOptions {
        thing?: Color;
    }
}

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}