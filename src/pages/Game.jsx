import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Trivia from "../components/Trivia";
import { TEAM_ONE, TEAM_TWO } from "../consts";
import CategorySelector from "../components/CategorySelector";
import "./game.css";
import "../components/round.css";

const numQuestionsToFetch = 50;
const totalRounds = 1;
const questionsPerRound = 10;

function useLocalStorage(key, defaultValue) {
  const [val, setVal] = useState(localStorage.getItem(key) || defaultValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [val]);

  return [val, setVal];
}

// replacer is optional
function useLocalStorageRef(key, { defaultValue, replacer }) {
  const ref = useRef(JSON.parse(localStorage.getItem(key)) || defaultValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(ref.current, replacer));
  }, [ref.current]);

  return ref;
}

export default function Game({ fetchTrivia }) {
  const [turn, setTurn] = useState(TEAM_ONE);

  // TODO: move state into TriviaItem
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [currQuestionNumber, setCurrQuestionNumber] = useState(1);

  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);

  const seen = useRef(new Set());
  // TODO: don't use state for teamOneName and teamTwoName
  // I do however need to cache the value.
  const [teamOneName, setTeamOneName] = useState("");
  const [teamTwoName, setTeamTwoName] = useState("");

  // I'm "pre-fetching" trivia questions so we don't have to wait for loading
  const [trivia, setTrivia] = useState();

  // TODO: stop using this piece of state, since we removed "multiple rounds"
  const [currRoundNumber, setCurrRoundNumber] = useState(1);

  // I use these categories to fetch questions, but they aren't exactly needed
  // for rendering... think about this.
  const [categories, setCategories] = useState("");

  // TODO: do I need this state or can I calculate the value somehow?
  // currQuestionNumber could start as 0 and when the first question is viewed, it goes up to 1?
  // roundInProgress = currQuestionNumber === 0
  // ( and we dont display it in the category selector screen )
  const [roundInProgress, setRoundInProgress] = useState(false);

  const [score, setScore] = useState({ [TEAM_ONE]: 0, [TEAM_TWO]: 0 });
  const gameCompleted = currRoundNumber > totalRounds;
  const navigate = useNavigate();
  let location = useLocation();
  let params = new URLSearchParams(location.search);

  useEffect(() => {});

  function isSaveGame() {
    return Boolean(localStorage.getItem("saveData"));
  }

  function hasRequiredQueryParams() {
    return params.has("teamone") && params.has("teamtwo");
  }

  function toJson() {
    return JSON.stringify({
      turn: turn,
      questionCompleted: questionCompleted,
      currQuestionNumber: currQuestionNumber,
      currentTriviaIdx: currentTriviaIdx,
      teamOneName: teamOneName,
      teamTwoName: teamTwoName,
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
      }
      let seenQuestions = localStorage.getItem("seenQuestions");
      const dataToSave = new Set(JSON.parse(seenQuestions));
      seen.current = seenQuestions ? dataToSave : seen.current;
      return;
    }
    if (gameCompleted) {
      localStorage.removeItem("saveData");
      navigate(
        `/win?teamone=${encodeURIComponent(
          teamOneName
        )}&teamtwo=${encodeURIComponent(teamTwoName)}&teamonescore=${
          score[0]
        }&teamtwoscore=${score[1]}`
      );
    } else {
      save();
    }
  }, [
    turn,
    questionCompleted,
    currQuestionNumber,
    currentTriviaIdx,
    seen.current,
    teamOneName,
    teamTwoName,
    trivia,
    currRoundNumber,
    categories,
    roundInProgress,
    score,
    gameCompleted,
  ]);

  // handle redirects
  useEffect(() => {
    if (!isSaveGame() && !hasRequiredQueryParams()) {
      if (!gameCompleted) navigate("/setup");
    }
  }, []);

  useEffect(() => {
    if (!hasRequiredQueryParams()) return;
    setTeamOneName(params.get("teamone"));
    setTeamTwoName(params.get("teamtwo"));
  }, []);

  // this is how I'm avoiding a duplicate "first" question
  useEffect(() => {
    !roundInProgress &&
      trivia &&
      setCurrentTriviaIdx(firstUnseenTriviaIdx(trivia, seen.current));
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
      {gameCompleted ? (
        <h1>
          {score[TEAM_ONE] > score[TEAM_TWO] && `${teamOneName} wins!`}
          {score[TEAM_TWO] > score[TEAM_ONE] && `${teamTwoName} wins!`}
          {score[TEAM_ONE] === score[TEAM_TWO] && "Its a tie!"}
        </h1>
      ) : roundInProgress ? (
        <div className="round">
          <span className="round__stats">
            <div className="round__stats-item round__stats-item_t1">{`${teamOneName}: ${score[TEAM_ONE]}`}</div>{" "}
            <div className="round__stats-item">{`Q ${currQuestionNumber} / ${questionsPerRound}`}</div>
            <div className="round__stats-item round__stats-item_t2">{`${teamTwoName}: ${score[TEAM_TWO]}`}</div>
          </span>
          <Trivia
            question={trivia[currentTriviaIdx].question}
            choices={trivia[currentTriviaIdx].choices}
            correctAnswer={trivia[currentTriviaIdx].correctAnswer}
            id={trivia[currentTriviaIdx].id}
            key={trivia[currentTriviaIdx].id}
            seen={seen}
            team={turn}
            teamNames={{ [TEAM_ONE]: teamOneName, [TEAM_TWO]: teamTwoName }}
            increaseScore={increaseScore}
            questionCompleted={questionCompleted}
            setQuestionCompleted={setQuestionCompleted}
          />

          {questionCompleted && (
            <button
              className="button button_submit game__next-button"
              onClick={() => nextQuestion(trivia)}
            >
              {currQuestionNumber === questionsPerRound
                ? "Next"
                : "Next Question"}
            </button>
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
