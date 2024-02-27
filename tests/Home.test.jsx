import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { describe, it, expect } from "vitest";
import Home from "../src/pages/Home";

describe("Home", () => {
  it("renders the Home component", () => {
    render(<Home />, { wrapper: BrowserRouter });

    screen.debug(); // prints out the jsx in the Home component unto the command line
  });
});
