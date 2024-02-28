import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { describe, it, expect, beforeAll } from "vitest";
import Game from "../src/pages/Game";

const mockData = JSON.stringify({
  turn: 1,
  questionCompleted: false,
  currQuestionNumber: 2,
  currentTriviaIdx: 1,
  teamOneName: "myteamname",
  teamTwoName: "t2name",
  trivia: [
    {
      id: "622a1c377cc59eab6f9504ff",
      category: "science",
      question: "What is Ludology the study of?",
      correctAnswer: "games and play",
      choices: [
        "the scientific study of baths, bathing and of their application to disease",
        "blood serum",
        "word origins",
        "games and play",
      ],
    },
    {
      id: "622a1c3a7cc59eab6f950fd8",
      category: "science",
      question: "Which vital organ does the adjective renal refer to?",
      correctAnswer: "Kidney",
      choices: ["Lung", "Kidney", "Heart", "Liver"],
    },
    {
      id: "622a1c367cc59eab6f9503ef",
      category: "science",
      question:
        "What did Francis Crick and James Watson build a molecular model of in 1953?",
      correctAnswer: "DNA",
      choices: ["The Brain", "Dark Matter", "Beta Radiation", "DNA"],
    },
    {
      id: "650570497a97013de78b5574",
      category: "science",
      question: "Which of these can cause a thunderstorm?",
      correctAnswer: "Warm air moving up fast",
      choices: [
        "Warm air moving up fast",
        "Clouds at high altitudes",
        "Ozone touching cloud",
        "Earthquakes",
      ],
    },
    {
      id: "622a1c377cc59eab6f950562",
      category: "science",
      question: "What is Dermatology the study of?",
      correctAnswer: "The skin",
      choices: ["Birds", "Parasites", "The Ancient Egyptians", "The skin"],
    },
    {
      id: "622a1c377cc59eab6f9505ac",
      category: "science",
      question: "What is Andrology the study of?",
      correctAnswer: "Male health and disease",
      choices: [
        "Male health and disease",
        "Animal behaviour",
        "The causation of disease",
        "The structure of cells",
      ],
    },
  ],
  currRoundNumber: 1,
  categories: ["science"],
  roundInProgress: true,
  score: {
    0: 1,
    1: 0,
  },
});

describe("Game", () => {
  it("renders the Game component", () => {
    render(<Game />, { wrapper: BrowserRouter });
  });
});

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
