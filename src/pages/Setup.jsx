import { Link } from "react-router-dom";
import { useState } from "react";
import "./setup.css";

const screens = ["pickTeamOneName", "pickTeamTwoName", "pickNumRounds"];

function NameSelector({ name, setName, title }) {
  return (
    <>
      <h1>{title}</h1>
      <input
        className="text-input"
        onChange={(e) => setName(e.target.value)}
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
  const [currIdx, setCurrIdx] = useState(0);

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
                  title="Pick a name for team one!"
                />
                <NextButton handleClick={nextScreen} />
              </>
            );
          case "pickTeamTwoName":
            return (
              <>
                <NameSelector
                  name={teamTwoName}
                  setName={setTeamTwoName}
                  title="Pick a name for team two!"
                />
                <div className="setup__next-back-container">
                  <BackButton handleClick={goBack} />
                  <NextButton handleClick={nextScreen} />
                </div>
              </>
            );
          case "pickNumRounds":
            return (
              <>
                <h1>
                  Pick the number of rounds & the number of questions per round!
                </h1>
                <div className="setup__select-container">
                  <label htmlFor="num-rounds-select">Number of rounds</label>
                  <select id="num-rounds-select">
                    <option value="1">1</option>
                    <option selected="selected" value="2">
                      2
                    </option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div className="setup__select-container">
                  <label htmlFor="num-questions-select">
                    <em>Total</em> number of questions per round
                  </label>
                  <select id="num-questions-select">
                    {Array.from({ length: 20 }).map((val, idx) => (
                      <option
                        selected={idx === 5 ? "selected" : ""}
                        key={idx}
                        value={idx + 1}
                      >
                        {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="setup__next-back-container">
                  <BackButton handleClick={goBack} />
                  <Link to="/game">
                    <button className="button button_submit setup__name-selector__button">
                      Start
                    </button>
                  </Link>
                </div>
              </>
            );
        }
      })()}
    </div>
  );
}
