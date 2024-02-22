import "./round.css";
import { TEAM_ONE, TEAM_TWO } from "../consts";
import Trivia from "./Trivia";

export default function Round({
  trivia,
  teamNames, // { [TEAM_ONE]: teamOneName, [TEAM_TWO]: teamTwoName }
  seen,
  numQuestionsInRound, // int
  incrementRound, // function(void)
  setRoundInProgress, // function,
  increaseScore, // function
  turn,
  setTurn,
  questionCompleted,
  setQuestionCompleted,
  numQuestionsSeen,
  currentTriviaIdx,
  setCurrentTriviaIdx,
}) {
  const swapTurn = () =>
    setTurn((prevTurn) => (prevTurn === TEAM_ONE ? TEAM_TWO : TEAM_ONE));

  function nextQuestion() {
    if (!trivia) return;
    if (numQuestionsSeen.current === numQuestionsInRound) {
      incrementRound();
      setRoundInProgress(false);
      return;
    }

    setCurrentTriviaIdx((prevIdx) => {
      let newIdx = prevIdx + 1;

      while (newIdx < trivia.length) {
        if (seen.current.has(trivia[newIdx].id)) {
          newIdx++;
        } else {
          break;
        }
      }

      return newIdx;
    });
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
        id={trivia[currentTriviaIdx].id}
        seen={seen}
        team={turn}
        teamNames={teamNames}
        increaseScore={increaseScore}
        questionCompleted={questionCompleted}
        setQuestionCompleted={setQuestionCompleted}
      />
      {questionCompleted && (
        <button onClick={nextQuestion}>Next Question</button>
      )}
    </div>
  );
}
