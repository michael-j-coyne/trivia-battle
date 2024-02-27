import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { describe, it, expect } from "vitest";
import Game from "../src/pages/Game";

describe("Game", () => {
  it("renders the Game component", () => {
    render(<Game />, { wrapper: BrowserRouter });
  });
});
