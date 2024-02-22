import "./trivia.css";
import { useState, useEffect } from "react";

// question: String
// options: Array[String]
export default function Trivia({
  question,
  choices,
  correctAnswer,
  id,
  seen,
  team,
  teamNames,
  increaseScore,
  questionCompleted,
  setQuestionCompleted,
}) {
  const [isStealMode, setIsStealMode] = useState(false);
  const [selectedAns, setSelectedAns] = useState();
  const [stolenAns, setStolenAns] = useState();

  useEffect(() => {
    setSelectedAns();
    setStolenAns();
    setIsStealMode(false);
  }, [question]);

  useEffect(() => {
    seen.current.add(id);
  }, [id]);

  const oppositeTeam = (team) => Number(!team);

  function handleClick(choice) {
    if (isStealMode) {
      setStolenAns({ answer: choice, correct: choice === correctAnswer });
      if (choice === correctAnswer) {
        // give the point to the OPPOSING team since they are the ones stealing
        increaseScore({ team: oppositeTeam(team), amount: 1 });
      }
      setQuestionCompleted(true);
    } else {
      setSelectedAns({ answer: choice, correct: choice === correctAnswer });
      if (choice === correctAnswer) {
        increaseScore({ team: team, amount: 1 });
        setQuestionCompleted(true);
      } else {
        setIsStealMode(true);
      }
    }
  }

  const optionElems = choices.map((choice, idx) => (
    <button
      onClick={() => handleClick(choice)}
      className={
        "trivia__choice" +
        (selectedAns?.answer === choice
          ? selectedAns.correct
            ? " trivia__choice_correct"
            : " trivia__choice_incorrect"
          : "") +
        (stolenAns?.answer === choice
          ? stolenAns.correct
            ? " trivia__choice_correct"
            : " trivia__choice_incorrect"
          : "") +
        (questionCompleted && choice !== correctAnswer
          ? " trivia__choice_faded"
          : "") +
        (questionCompleted && choice === correctAnswer
          ? " trivia__choice_correct"
          : "")
      }
      disabled={questionCompleted || choice === selectedAns?.answer}
      key={idx}
    >
      {choice}
    </button>
  ));

  const preamble = isStealMode
    ? `${teamNames[oppositeTeam(team)]}, your chance to steal! `
    : `${teamNames[team]}: `;

  return (
    <div className="trivia">
      <h1 className="trivia__title">{`${preamble}${question}`}</h1>
      <div className="trivia__choice-container">{optionElems}</div>
    </div>
  );
}
