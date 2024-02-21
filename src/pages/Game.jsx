/*
  This page is where users will spend most of their time. The actual "game"
  takes place here.

  During the game, players divide into two teams, and will take turns
  answering questions.

  If a team gets a question wrong, the opposing team could get a chance to "steal" a multiple choice question, but they would only get half a point since one of the options has been eliminated already.

  Players could instead choose to "skip" a question, depriving the opposing team of the opportunity to steal.

  I'll implement this page first, using some data from a .json file so I can focus on the game flow and ignore the fetching logic for now.
  */

import { useState, useEffect } from "react";
import Round from "../components/Round";
import CategorySelector from "../components/CategorySelector";
import fetchTrivia from "../fetchTrivia";
import "./game.css";

const numQuestionsToFetch = 50;

export default function Game() {
  const [trivia, setTrivia] = useState();
  const [currRoundNumber, setCurrRoundNumber] = useState(1);
  const [categories, setCategories] = useState("");
  const [roundInProgress, setRoundInProgress] = useState(false);

  function handleCategorySubmit(categoryIdArr) {
    setCategories(categoryIdArr);
    fetchTrivia({
      amount: numQuestionsToFetch,
      categories: categoryIdArr.join(),
      difficulties: "easy,medium,hard",
    })
      .then((trivia) => setTrivia(trivia))
      .then(() => setRoundInProgress(true))
      .catch((e) => console.error(e));
  }

  return (
    <div className="game">
      {roundInProgress ? (
        <Round
          trivia={trivia}
          numQuestionsInRound={10}
          setRoundInProgress={setRoundInProgress}
        />
      ) : (
        <CategorySelector
          initialCategories={categories}
          handleSubmit={handleCategorySubmit}
          teamName={currRoundNumber % 2 == 0 ? "Team 2" : "Team 1"}
          buttonText={
            currRoundNumber == 1
              ? "Start game"
              : `Start round ${currRoundNumber}`
          }
        />
      )}
    </div>
  );
}
