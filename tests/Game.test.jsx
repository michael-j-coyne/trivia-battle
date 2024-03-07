import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

import { describe, it, expect, beforeAll } from "vitest";
import Game from "../src/pages/Game";
import Win from "../src/pages/Win";
import Setup from "../src/pages/Setup";
import Home from "../src/pages/Home";

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

async function fetchMockTrivia() {
  return mockTrivia;
}

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

function expectCategorySelectScreen() {
  screen.getByText(/select categories!/i);
  screen.getByRole("button", { name: /music/i });
  screen.getByRole("button", { name: /history/i });
  screen.getByRole("button", { name: /general knowledge/i });
  screen.getByRole("button", { name: /geography/i });
  screen.getByRole("button", { name: /start game/i });

  return true;
}

function expectHomeScreen() {
  screen.getByText(/trivia battle!/i);
  screen.getByRole("button", { name: /get started/i });
}

function expectTeamOneNameSelectScreen() {
  screen.getByText(/team one/i);
  screen.getByText(/pick a name/i);

  screen.getByRole("textbox", { name: /team name/i });
  screen.getByRole("button", { name: /next/i });
}

function expectTeamTwoNameSelectScreen() {
  screen.getByText(/team two/i);
  screen.getByText(/pick a name/i);

  screen.getByRole("textbox", { name: /team name/i });

  screen.getByRole("button", { name: /go back/i });
  screen.getByRole("button", { name: /next/i });
}

function isSetupScreen() {
  screen.getByText(/pick a name/i);
  screen.getByRole("button", { name: /next/i });

  return true;
}

function expectGameScreen() {
  screen.getAllByText(teamOneName, { exact: false });
  screen.getAllByText(teamTwoName, { exact: false });

  screen.getByRole("button", { name: /option 1/i });
  screen.getByRole("button", { name: /option 2/i });
  screen.getByRole("button", { name: /option 3/i });
  screen.getByRole("button", { name: /option 4/i });

  return true;
}

function expectWinScreen(winner) {
  screen.getByText(`${winner} win(s)!`, { exact: false });
  screen.getByRole("button", { name: /play again/i });
}

function expectStealMode(stealingTeamName) {
  screen.getByText(`${stealingTeamName}, your chance to steal!`, {
    exact: false,
  });
}

function expectScoreToBe(teamOneScore, teamTwoScore) {
  screen.getByText(`${teamOneName}: ${teamOneScore}`);
  screen.getByText(`${teamTwoName}: ${teamTwoScore}`);
}

function expectQuestionNumberToBe(questionNum) {
  screen.getByText(`Q ${questionNum} / 10`);
}

function questionCompleted() {
  return screen.queryByText(/next question/i) !== null;
}

describe("Load /game route without query params or saveData", () => {
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

describe("Load /game route with query params", () => {
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

    expect(expectCategorySelectScreen()).toEqual(true);
  });
});

describe("Load <Game /> with saveData in localstorage", () => {
  beforeAll(() => {
    localStorage.setItem("saveData", mockDataInGame);
    return () => {
      localStorage.clear();
    };
  });

  it("Should initialize the Game component using the saveData in localstorage", () => {
    render(<Game />, { wrapper: BrowserRouter });
    expect(expectGameScreen()).toEqual(true);
  });
});

describe("Play through the game", () => {
  it("plays through the entire game. Starts at the home page, goes through and picks team names, then starts the game. Tests out steal mode, ensures points are incremented, ensures win screen is displayed at the end.", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/",
          },
        ]}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route
            path="/game"
            // FYI: the fetchMockTrivia function does not take category selection into account.
            element={<Game fetchTrivia={fetchMockTrivia} />}
          />
          <Route path="/win" element={<Win />} />
        </Routes>
      </MemoryRouter>
    );

    // utility funcs
    const goNextQuestion = async () =>
      await user.click(screen.getByRole("button", { name: /next question/i }));
    const pickOption = async (optionName) =>
      await user.click(screen.getByRole("button", { name: optionName }));

    // begin test
    expectHomeScreen();

    await user.click(screen.getByRole("button", { name: /get started/i }));

    expectTeamOneNameSelectScreen();

    await user.type(
      screen.getByRole("textbox", { name: /team name/i }),
      teamOneName
    );
    await user.click(screen.getByRole("button", { name: /next/i }));

    expectTeamTwoNameSelectScreen();

    await user.type(
      screen.getByRole("textbox", { name: /team name/i }),
      teamTwoName
    );
    await user.click(screen.getByRole("button", { name: /next/i }));

    expectCategorySelectScreen();
    expect(localStorage.getItem("saveData")).toBeNull();

    // we're just going to select a category so that we can start the game, though
    // selecting the category has no effect on what type of trivia is returned
    // in this test.
    await user.click(screen.getByRole("button", { name: /history/i }));
    await user.click(screen.getByRole("button", { name: /start game/i }));

    expectGameScreen();
    expectQuestionNumberToBe(1);
    expect(localStorage.getItem("saveData")).not.toBeNull();

    await pickOption(/option 2/i);

    expectScoreToBe(1, 0);
    await goNextQuestion();
    expectQuestionNumberToBe(2);

    await pickOption(/option 3/i);
    expectStealMode(teamOneName);
    expectScoreToBe(1, 0);

    await pickOption(/option 2/i);
    expectScoreToBe(2, 0);

    await goNextQuestion();
    await pickOption(/option 4/i);
    expectStealMode(teamTwoName);

    // nothing should happen, button should be disabled
    await pickOption(/option 4/i);
    expect(questionCompleted()).toBeFalsy();

    // picked the wrong answer during steal, no points should be awarded
    await pickOption(/option 3/i);
    expect(questionCompleted()).toBeTruthy();
    expectScoreToBe(2, 0);
    expectQuestionNumberToBe(3);

    await goNextQuestion();

    await pickOption(/option 2/i);
    expectScoreToBe(2, 1);
    await goNextQuestion();

    await pickOption(/option 2/i);
    await goNextQuestion();

    await pickOption(/option 2/i);
    await goNextQuestion();

    await pickOption(/option 2/i);
    await goNextQuestion();

    await pickOption(/option 2/i);
    await goNextQuestion();

    await pickOption(/option 2/i);
    await goNextQuestion();

    await pickOption(/option 2/i);

    await user.click(screen.getByRole("button", { name: /next/i }));
    expectWinScreen(teamOneName);
  });
});
