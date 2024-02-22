import "./round.css";
import { TEAM_ONE, TEAM_TWO } from "../consts";
import { useState, useRef } from "react";
import Trivia from "./Trivia";

export default function Round({
  trivia,
  startingTeam, // int
  teamNames, // { [TEAM_ONE]: teamOneName, [TEAM_TWO]: teamTwoName }
  numQuestionsInRound, // int
  incrementRound, // function(void)
  seenQuestions, // Set(string)
  updateSeenQuestions, // function
  setRoundInProgress, // function,
  increaseScore, // function
}) {
  const [turn, setTurn] = useState(startingTeam);
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const numQuestionsSeen = useRef(1);
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);

  const swapTurn = () =>
    setTurn((prevTurn) => (prevTurn === TEAM_ONE ? TEAM_TWO : TEAM_ONE));

  function nextQuestion() {
    if (!trivia) return;
    if (numQuestionsSeen.current === numQuestionsInRound) {
      incrementRound();
      setRoundInProgress(false);
      return;
    }

    // Logic for checking if question has been seen will go here-ish
    setCurrentTriviaIdx((prevIdx) => prevIdx + 1);
    numQuestionsSeen.current = numQuestionsSeen.current + 1;
    swapTurn();
    setQuestionCompleted(false);
  }

  return (
    <div className="round">
      <Trivia
        question={trivia[currentTriviaIdx].question}
        choices={trivia[currentTriviaIdx].choices}
        correctAnswer={trivia[currentTriviaIdx].correctAnswer}
        team={turn}
        teamNames={teamNames}
        increaseScore={increaseScore}
        setQuestionCompleted={setQuestionCompleted}
      />
      {questionCompleted && (
        <button onClick={nextQuestion}>Next Question</button>
      )}
    </div>
  );
}
