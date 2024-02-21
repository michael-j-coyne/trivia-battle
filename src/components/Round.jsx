import "./round.css";
import { useState, useRef } from "react";
import Trivia from "./Trivia";

export default function Round({
  trivia,
  teamOneName, // string
  teamTwoName, // string
  numQuestionsInRound, // int
  incrementRound, // function(void)
  seenQuestions, // Set(string)
  updateSeenQuestions, // function
  setRoundInProgress, // function
}) {
  const numQuestionsSeen = useRef(1);
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);

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
  }
  return (
    <div className="round">
      <Trivia
        question={trivia[currentTriviaIdx].question}
        choices={trivia[currentTriviaIdx].choices}
      />
      <button onClick={nextQuestion}>Next Question</button>
    </div>
  );
}
