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

export default function Game() {
  const [trivia, setTrivia] = useState();

  useEffect(() => {
    fetchTrivia({
      amount: 1,
      categories: "society_and_culture,science",
      difficulties: "easy,medium,hard",
    })
      .then((trivia) => setTrivia(trivia))
      .catch((e) => console.error(e));
  }, []);

  console.log(trivia);

  return (
    <div>
      {trivia && (
        <Trivia question={trivia[0].question} choices={trivia[0].choices} />
      )}
    </div>
  );
}
