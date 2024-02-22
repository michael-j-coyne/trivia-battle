/*
  This page is where users will spend most of their time. The actual "game"
  takes place here.

  During the game, players divide into two teams, and will take turns
  answering questions.

  If a team gets a question wrong, the opposing team could get a chance to "steal" a multiple choice question, but they would only get half a point since one of the options has been eliminated already.

  Players could instead choose to "skip" a question, depriving the opposing team of the opportunity to steal.

  I'll implement this page first, using some data from a .json file so I can focus on the game flow and ignore the fetching logic for now.
  */

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TEAM_ONE, TEAM_TWO } from "../consts";
import Round from "../components/Round";
import CategorySelector from "../components/CategorySelector";
import fetchTrivia from "../fetchTrivia";
import "./game.css";

const numQuestionsToFetch = 50;

export default function Game() {
  const [turn, setTurn] = useState(TEAM_ONE);
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const numQuestionsSeen = useRef(1);
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);

  const [teamOneName, setTeamOneName] = useState("");
  const [teamTwoName, setTeamTwoName] = useState("");
  const [totalRounds, setTotalRounds] = useState(1);
  const [questionsPerRound, setQuestionsPerRound] = useState(1);
  const [trivia, setTrivia] = useState();
  const [currRoundNumber, setCurrRoundNumber] = useState(1);
  const [categories, setCategories] = useState("");
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [score, setScore] = useState({ [TEAM_ONE]: 0, [TEAM_TWO]: 0 });
  const gameCompleted = currRoundNumber > totalRounds;
  const navigate = useNavigate();
  let location = useLocation();
  let params = new URLSearchParams(location.search);

  function isSaveGame() {
    return false;
  }

  function hasRequiredQueryParams() {
    return (
      params.has("teamone") &&
      params.has("teamtwo") &&
      params.has("rounds") &&
      params.has("questions")
    );
  }

  useEffect(() => {
    // reset stuff
    setTurn(currRoundNumber % 2 == 0 ? TEAM_TWO : TEAM_ONE);
    setQuestionCompleted(false);
    numQuestionsSeen.current = 1;
    setCurrentTriviaIdx(0);
  }, [currRoundNumber]);

  useEffect(() => {
    if (!isSaveGame() && !hasRequiredQueryParams()) {
      console.log("navigating");
      navigate("/setup");
    }
  }, []);

  useEffect(() => {
    if (!hasRequiredQueryParams()) return;
    // I could validate input here. However, if the user of the game
    // wants to pass bad data, they're more than welcome. It only hurts them after all!
    setTeamOneName(params.get("teamone"));
    setTeamTwoName(params.get("teamtwo"));
    setTotalRounds(Number(params.get("rounds")));
    setQuestionsPerRound(Number(params.get("questions")));
  }, []);

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
      {gameCompleted ? (
        <h1>
          {score[TEAM_ONE] > score[TEAM_TWO] && `${teamOneName} wins!`}
          {score[TEAM_TWO] > score[TEAM_ONE] && `${teamTwoName} wins!`}
          {score[TEAM_ONE] === score[TEAM_TWO] && "Its a tie!"}
        </h1>
      ) : roundInProgress ? (
        <Round
          trivia={trivia}
          startingTeam={currRoundNumber % 2 == 0 ? TEAM_TWO : TEAM_ONE}
          teamNames={{ [TEAM_ONE]: teamOneName, [TEAM_TWO]: teamTwoName }}
          numQuestionsInRound={questionsPerRound}
          incrementRound={() => setCurrRoundNumber((prev) => prev + 1)}
          setRoundInProgress={setRoundInProgress}
          increaseScore={increaseScore}
          turn={turn}
          setTurn={setTurn}
          questionCompleted={questionCompleted}
          setQuestionCompleted={setQuestionCompleted}
          numQuestionsSeen={numQuestionsSeen}
          currentTriviaIdx={currentTriviaIdx}
          setCurrentTriviaIdx={setCurrentTriviaIdx}
        />
      ) : (
        <CategorySelector
          initialCategories={categories}
          handleSubmit={handleCategorySubmit}
          teamName={currRoundNumber % 2 == 0 ? teamTwoName : teamOneName}
          currRoundNumber={currRoundNumber}
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
