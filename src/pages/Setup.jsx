import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./setup.css";

const screens = ["pickTeamOneName", "pickTeamTwoName", "pickNumRounds"];
const nameLengthLimit = 12;

function NameSelector({ name, setName, title }) {
  return (
    <>
      <h1>{title}</h1>
      <input
        className="text-input"
        onChange={(e) =>
          e.target.value.length <= nameLengthLimit && setName(e.target.value)
        }
        type="text"
        value={name}
      ></input>
    </>
  );
}

function NextButton({ handleClick }) {
  return (
    <button
      onClick={handleClick}
      className="button button_submit setup__name-selector__button"
    >
      Next
    </button>
  );
}

function BackButton({ handleClick }) {
  return (
    <button
      onClick={handleClick}
      className="button button_submit setup__name-selector__button"
    >
      Go back
    </button>
  );
}

export default function Setup() {
  const [teamOneName, setTeamOneName] = useState("");
  const [teamTwoName, setTeamTwoName] = useState("");
  const [numRounds, setNumRounds] = useState(2);
  const [numQuestionsPerRound, setNumQuestionsPerRound] = useState(8);
  const [currIdx, setCurrIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const saveData = localStorage.getItem("saveData");
    if (saveData) {
      navigate("/continue");
    }
  }, []);

  function nextScreen() {
    setCurrIdx((prevIdx) => (prevIdx < 2 ? prevIdx + 1 : prevIdx));
  }

  function goBack() {
    setCurrIdx((prevIdx) => (prevIdx > 0 ? prevIdx - 1 : prevIdx));
  }

  return (
    <div className="setup">
      {(() => {
        switch (screens[currIdx]) {
          case "pickTeamOneName":
            return (
              <>
                <NameSelector
                  name={teamOneName}
                  setName={setTeamOneName}
                  title={
                    <>
                      Team one,
                      <br />
                      pick a name!
                    </>
                  }
                />
                <NextButton
                  handleClick={() => {
                    if (teamOneName === "") {
                      // should show error to user
                      return;
                    }
                    nextScreen();
                  }}
                />
              </>
            );
          case "pickTeamTwoName":
            return (
              <>
                <NameSelector
                  name={teamTwoName}
                  setName={setTeamTwoName}
                  title={
                    <>
                      Team two,
                      <br />
                      pick a name!
                    </>
                  }
                />
                <div className="setup__next-back-container">
                  <BackButton handleClick={goBack} />
                  <NextButton
                    handleClick={() => {
                      if (teamTwoName === "" || teamTwoName === teamOneName) {
                        // should show error to user
                        return;
                      }
                      navigate(
                        `/game?teamone=${encodeURIComponent(
                          teamOneName
                        )}&teamtwo=${encodeURIComponent(teamTwoName)}`
                      );
                      // nextScreen();
                    }}
                  />
                </div>
              </>
            );
          // case "pickNumRounds":
          //   return (
          //     <>
          //       <h1>
          //         Pick the number of rounds & the number of questions per round!
          //       </h1>
          //       <div className="setup__select-container">
          //         <label htmlFor="num-rounds-select">Number of rounds</label>
          //         <select
          //           value={numRounds}
          //           onChange={(e) => setNumRounds(e.target.value)}
          //           id="num-rounds-select"
          //         >
          //           <option value="1">1</option>
          //           <option value="2">2</option>
          //           <option value="3">3</option>
          //           <option value="4">4</option>
          //         </select>
          //       </div>
          //       <div className="setup__select-container">
          //         <label htmlFor="num-questions-select">
          //           <em>Total</em> number of questions per round
          //         </label>
          //         <select
          //           value={numQuestionsPerRound}
          //           onChange={(e) => setNumQuestionsPerRound(e.target.value)}
          //           id="num-questions-select"
          //         >
          //           {Array.from({ length: 10 }).map((val, idx) => (
          //             <option key={idx} value={idx * 2 + 2}>
          //               {idx * 2 + 2}
          //             </option>
          //           ))}
          //         </select>
          //       </div>
          //       <div className="setup__next-back-container">
          //         <BackButton handleClick={goBack} />
          //         <Link
          //           to={`/game?teamone=${encodeURIComponent(
          //             teamOneName
          //           )}&teamtwo=${encodeURIComponent(
          //             teamTwoName
          //           )}&rounds=${numRounds}&questions=${numQuestionsPerRound}`}
          //         >
          //           <button className="button button_submit setup__name-selector__button">
          //             Start
          //           </button>
          //         </Link>
          //       </div>
          //     </>
          //   );
        }
      })()}
    </div>
  );
}
