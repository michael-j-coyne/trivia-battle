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
import Trivia from "../components/Trivia";
import fetchTrivia from "../fetchTrivia";
import "./game.css";

export default function Game() {
  const [trivia, setTrivia] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTrivia({
      amount: 50,
      categories: "society_and_culture,science",
      difficulties: "easy,medium,hard",
    })
      .then((trivia) => setTrivia(trivia))
      .catch((e) => console.error(e));
  }, []);

  console.log(trivia);

  function nextQuestion() {
    if (!trivia) return;
    if (currentIndex == trivia.length - 1) {
      console.error("There aren't any more questions!");
      return;
    }
    setCurrentIndex((oldIdx) => oldIdx + 1);
  }

  return (
    <div className="game">
      {trivia && (
        <>
          <Trivia
            question={trivia[currentIndex].question}
            choices={trivia[currentIndex].choices}
          />
          <button onClick={nextQuestion}>Next Question</button>
        </>
      )}
    </div>
  );
}
