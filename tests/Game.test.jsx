import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

import { describe, it, expect, beforeAll } from "vitest";
import Game from "../src/pages/Game";
import Setup from "../src/pages/Setup";

const teamOneName = "myteamname";
const teamTwoName = "t2name";

const mockTrivia = [
  {
    id: "1",
    category: "science",
    question: "question 1",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "2",
    category: "science",
    question: "question 2",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "3",
    category: "science",
    question: "question 3",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "4",
    category: "science",
    question: "question 4",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "5",
    category: "science",
    question: "question 5",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "6",
    category: "science",
    question: "question 6",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "7",
    category: "science",
    question: "question 7",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "8",
    category: "science",
    question: "question 8",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "9",
    category: "science",
    question: "question 9",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
  {
    id: "10",
    category: "science",
    question: "question 10",
    correctAnswer: "option 2",
    choices: ["option 1", "option 2", "option 3", "option 4"],
  },
];

const mockDataInGame = JSON.stringify({
  turn: 1,
  questionCompleted: false,
  currQuestionNumber: 2,
  currentTriviaIdx: 1,
  teamOneName: teamOneName,
  teamTwoName: teamTwoName,
  trivia: mockTrivia,
  currRoundNumber: 1,
  categories: ["science"],
  roundInProgress: true,
  score: {
    0: 1,
    1: 0,
  },
});

function isCategorySelectScreen() {
  screen.getByText(/select categories!/i);
  screen.getByRole("button", { name: /music/i });
  screen.getByRole("button", { name: /history/i });
  screen.getByRole("button", { name: /general knowledge/i });
  screen.getByRole("button", { name: /geography/i });
  screen.getByRole("button", { name: /start game/i });

  return true;
}

function isSetupScreen() {
  screen.getByText(/pick a name/i);
  screen.getByRole("button", { name: /next/i });

  return true;
}

function isGameScreen() {
  screen.getAllByText(teamOneName, { exact: false });
  screen.getAllByText(teamTwoName, { exact: false });

  screen.getByRole("button", { name: /option 1/i });
  screen.getByRole("button", { name: /option 2/i });
  screen.getByRole("button", { name: /option 3/i });
  screen.getByRole("button", { name: /option 4/i });

  return true;
}

describe("Load /game route without query params and without query string", () => {
  it("Should redirect to /setup", () => {
    render(
      <MemoryRouter initialEntries={["/game"]}>
        <Routes>
          <Route path="/setup" element={<Setup />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </MemoryRouter>
    );

    expect(isSetupScreen()).toEqual(true);
  });
});

describe("Load /game route without query params but with query string params", () => {
  it("Should redirect to /setup", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/game",
            search: `?teamone=${teamOneName}&teamtwo=${teamTwoName}`,
          },
        ]}
      >
        <Routes>
          <Route path="/setup" element={<Setup />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </MemoryRouter>
    );

    expect(isCategorySelectScreen()).toEqual(true);
  });
});

describe("Load <Game /> without query string params but with saveData", () => {
  beforeAll(() => {
    localStorage.setItem("saveData", mockDataInGame);
    return () => {
      localStorage.clear();
    };
  });

  it("Initializes the Game component using the saveData in localstorage", () => {
    render(<Game />, { wrapper: BrowserRouter });
    expect(isGameScreen()).toEqual(true);
  });
});
