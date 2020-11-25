import React from "react";
import App from "@src/components/app";
import { render } from "@testing-library/react";

it("should render a div", () => {
    const { getByText } = render(<App />);

    getByText("App");
});