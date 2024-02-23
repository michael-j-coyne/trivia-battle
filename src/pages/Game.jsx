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
import Trivia from "../components/Trivia";
import { TEAM_ONE, TEAM_TWO } from "../consts";
import CategorySelector from "../components/CategorySelector";
import fetchTrivia from "../fetchTrivia";
import "./game.css";
import "../components/round.css";

const numQuestionsToFetch = 50;
const totalRounds = 1;
const questionsPerRound = 10;

export default function Game() {
  const [turn, setTurn] = useState(TEAM_ONE);
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [currQuestionNumber, setCurrQuestionNumber] = useState(1);
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);

  const seen = useRef(new Set());
  const [teamOneName, setTeamOneName] = useState("");
  const [teamTwoName, setTeamTwoName] = useState("");
  // const [totalRounds, setTotalRounds] = useState(1);
  // const [questionsPerRound, setQuestionsPerRound] = useState(1);
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
    return Boolean(localStorage.getItem("saveData"));
  }

  function hasRequiredQueryParams() {
    return (
      params.has("teamone") && params.has("teamtwo")
      // params.has("rounds") &&
      // params.has("questions")
    );
  }

  function toJson() {
    return JSON.stringify({
      turn: turn,
      questionCompleted: questionCompleted,
      currQuestionNumber: currQuestionNumber,
      currentTriviaIdx: currentTriviaIdx,
      teamOneName: teamOneName,
      teamTwoName: teamTwoName,
      // totalRounds: totalRounds,
      // questionsPerRound: questionsPerRound,
      trivia: trivia,
      currRoundNumber: currRoundNumber,
      categories: categories,
      roundInProgress: roundInProgress,
      score: score,
    });
  }

  function fromJson(json) {
    let data = JSON.parse(json);

    setTurn(data.turn);
    setQuestionCompleted(data.questionCompleted);
    setCurrentTriviaIdx(data.currentTriviaIdx);
    setTeamOneName(data.teamOneName);
    setTeamTwoName(data.teamTwoName);
    setCurrQuestionNumber(data.currQuestionNumber);
    // setTotalRounds(data.totalRounds);
    // setQuestionsPerRound(data.questionsPerRound);
    setTrivia(data.trivia);
    setCurrRoundNumber(data.currRoundNumber);
    setCategories(data.categories);
    setRoundInProgress(data.roundInProgress);
    setScore(data.score);
  }

  function save() {
    const saveData = toJson();
    const seenQuestions = JSON.stringify([...seen.current]);

    localStorage.setItem("saveData", saveData);
    localStorage.setItem("seenQuestions", seenQuestions);
  }

  useEffect(() => {
    if (currRoundNumber === 1 && !roundInProgress) {
      // load data from save if it exists
      if (isSaveGame()) {
        fromJson(localStorage.getItem("saveData"));

        let seenQuestions = localStorage.getItem("seenQuestions");
        const dataToSave = new Set(JSON.parse(seenQuestions));
        seen.current = seenQuestions ? dataToSave : seen.current;
      }
      return;
    }

    save();
  }, [
    turn,
    questionCompleted,
    currQuestionNumber,
    currentTriviaIdx,
    seen.current,
    teamOneName,
    teamTwoName,
    // totalRounds,
    // questionsPerRound,
    trivia,
    currRoundNumber,
    categories,
    roundInProgress,
    score,
    gameCompleted,
  ]);

  useEffect(() => {
    // reset stuff
    setTurn(currRoundNumber % 2 == 0 ? TEAM_TWO : TEAM_ONE);
    setQuestionCompleted(false);
    setCurrQuestionNumber(1);
    setCurrentTriviaIdx(0);
  }, [currRoundNumber]);

  // handle redirects
  useEffect(() => {
    if (!isSaveGame() && !hasRequiredQueryParams()) {
      navigate("/setup");
    } else if (isSaveGame()) {
      console.log("saveData found");
      // navigate("/continue");
    }
  }, []);

  useEffect(() => {
    if (!hasRequiredQueryParams()) return;
    // I could validate input here. However, if the user of the game
    // wants to pass bad data, they're more than welcome. It only hurts them after all!
    setTeamOneName(params.get("teamone"));
    setTeamTwoName(params.get("teamtwo"));
    // setTotalRounds(Number(params.get("rounds")));
    // setQuestionsPerRound(Number(params.get("questions")));
  }, []);

  useEffect(() => {
    trivia && setCurrentTriviaIdx(firstUnseenTriviaIdx(trivia, seen.current));
  }, [trivia]);

  function increaseScore({ team, amount }) {
    setScore((prevScore) => ({
      ...prevScore,
      [team]: prevScore[team] + amount,
    }));
  }

  const swapTurn = () =>
    setTurn((prevTurn) => (prevTurn === TEAM_ONE ? TEAM_TWO : TEAM_ONE));

  const firstUnseenTriviaIdx = (triviaArray, seenSet) =>
    triviaArray.findIndex((item) => !seenSet.has(item.id));

  async function nextQuestion(trivia) {
    if (!trivia) return;
    if (currQuestionNumber === questionsPerRound) {
      setCurrRoundNumber((prev) => prev + 1);
      setRoundInProgress(false);
      return;
    }

    // I'm not handling 429 too many requests... which seems like it could
    // be a problem here
    const newQuestionIdx = firstUnseenTriviaIdx(trivia, seen.current);
    if (newQuestionIdx === -1) {
      const newTrivia = await fetchTrivia({
        amount: numQuestionsToFetch,
        categories: categories,
        difficulties: "easy,medium,hard",
      }).catch((e) => console.error(e));
      setTrivia(newTrivia);
      return nextQuestion(newTrivia);
    }

    setCurrentTriviaIdx(newQuestionIdx);
    setCurrQuestionNumber((prev) => prev + 1);
    swapTurn();
    setQuestionCompleted(false);
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
      {roundInProgress && (
        <span className="game__stats">
          <div className="game__stats-item">{`${teamOneName}: ${score[TEAM_ONE]}`}</div>{" "}
          <div className="game__stats-item">{`Q ${currQuestionNumber} / ${questionsPerRound}`}</div>
          <div className="game__stats-item">{`${teamTwoName}: ${score[TEAM_TWO]}`}</div>
        </span>
      )}
      {gameCompleted ? (
        <h1>
          {score[TEAM_ONE] > score[TEAM_TWO] && `${teamOneName} wins!`}
          {score[TEAM_TWO] > score[TEAM_ONE] && `${teamTwoName} wins!`}
          {score[TEAM_ONE] === score[TEAM_TWO] && "Its a tie!"}
        </h1>
      ) : roundInProgress ? (
        <div className="round">
          <Trivia
            question={trivia[currentTriviaIdx].question}
            choices={trivia[currentTriviaIdx].choices}
            correctAnswer={trivia[currentTriviaIdx].correctAnswer}
            id={trivia[currentTriviaIdx].id}
            seen={seen}
            team={turn}
            teamNames={{ [TEAM_ONE]: teamOneName, [TEAM_TWO]: teamTwoName }}
            increaseScore={increaseScore}
            questionCompleted={questionCompleted}
            setQuestionCompleted={setQuestionCompleted}
          />
          {questionCompleted && (
            <button onClick={() => nextQuestion(trivia)}>Next Question</button>
          )}
        </div>
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
