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
import { TEAM_ONE, TEAM_TWO } from "../consts";
import Round from "../components/Round";
import CategorySelector from "../components/CategorySelector";
import fetchTrivia from "../fetchTrivia";
import "./game.css";

const numQuestionsToFetch = 50;

export default function Game() {
  const teamOneName = "Team 1";
  const teamTwoName = "Team 2";
  const [trivia, setTrivia] = useState();
  const [currRoundNumber, setCurrRoundNumber] = useState(1);
  const [categories, setCategories] = useState("");
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [score, setScore] = useState({ [TEAM_ONE]: 0, [TEAM_TWO]: 0 });

  function increaseScore({ team, amount }) {
    setScore((prevScore) => ({
      ...prevScore,
      [team]: prevScore[team] + amount,
    }));
  }

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
      <span>{`${teamOneName}: ${score[TEAM_ONE]}pts - ${teamTwoName}: ${score[TEAM_TWO]}pts`}</span>
      {roundInProgress ? (
        <Round
          trivia={trivia}
          startingTeam={currRoundNumber % 2 == 0 ? TEAM_TWO : TEAM_ONE}
          teamNames={{ [TEAM_ONE]: teamOneName, [TEAM_TWO]: teamTwoName }}
          numQuestionsInRound={10}
          incrementRound={() => setCurrRoundNumber((prev) => prev + 1)}
          setRoundInProgress={setRoundInProgress}
          increaseScore={increaseScore}
        />
      ) : (
        <CategorySelector
          initialCategories={categories}
          handleSubmit={handleCategorySubmit}
          teamName={currRoundNumber % 2 == 0 ? teamTwoName : teamOneName}
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
