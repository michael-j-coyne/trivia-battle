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
import fetchTrivia from "../fetchTrivia";
import "./game.css";

export default function Game() {
  const [trivia, setTrivia] = useState();
  const [roundInProgress, setRoundInProgress] = useState(false);

  useEffect(() => {
    fetchTrivia({
      amount: 50,
      categories: "society_and_culture,science",
      difficulties: "easy,medium,hard",
    })
      .then((trivia) => setTrivia(trivia))
      .then(() => setRoundInProgress(true))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="game">
      {roundInProgress ? (
        <Round
          trivia={trivia}
          numQuestionsInRound={10}
          setRoundInProgress={setRoundInProgress}
        />
      ) : (
        <h1>This is a placeholder for the "between rounds" screen</h1>
      )}
    </div>
  );
}
