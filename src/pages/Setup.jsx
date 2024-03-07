import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./setup.css";

const screens = ["pickTeamOneName", "pickTeamTwoName"];
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
        aria-label="Team name"
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
      <div className="setup__content-container">
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
          }
        })()}
      </div>
    </div>
  );
}
