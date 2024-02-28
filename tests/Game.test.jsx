import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { describe, it, expect, beforeAll } from "vitest";
import Game from "../src/pages/Game";

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

const mockData = JSON.stringify({
  turn: 1,
  questionCompleted: false,
  currQuestionNumber: 2,
  currentTriviaIdx: 1,
  teamOneName: "myteamname",
  teamTwoName: "t2name",
  trivia: mockTrivia,
  currRoundNumber: 1,
  categories: ["science"],
  roundInProgress: true,
  score: {
    0: 1,
    1: 0,
  },
});

function isCategorySelectScreen(view) {}

describe("Load saveData", () => {
  beforeAll(() => {
    localStorage.setItem("saveData", mockData);
    return () => {
      localStorage.clear();
    };
  });

  const mockDataObj = JSON.parse(mockData);

  it("Initializes the Game component using the saveData in localstorage", () => {
    const { getAllByText, queryByText } = render(<Game />, {
      wrapper: BrowserRouter,
    });

    // I need "isGameScreen()" and "isCategorySelectScreen()" and "isWinScreen()"
    // functions

    // they will take the return value of render() as an argument
    // function isGameScreen(queries) { }

    // The "game" screen should contain BOTH of the team names
    getAllByText(mockDataObj.teamOneName, { exact: false });
    getAllByText(mockDataObj.teamTwoName, { exact: false });

    // We should not be in the start screen
    expect(queryByText("start game", { exact: false })).not.toBeInTheDocument();
  });
});
