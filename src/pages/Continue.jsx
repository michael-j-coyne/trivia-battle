import "./continue.css";
import { useNavigate } from "react-router-dom";

export default function Continue() {
  const navigate = useNavigate();

  return (
    <div className="continue">
      <h1>
        Looks like you have a game in progress.
        <br />
        <br />
        Continue your saved game, or start a new game?
        <br />
        <br />
      </h1>
      <div className="continue__button-container">
        <button
          onClick={() => {
            localStorage.setItem("oldData", localStorage.getItem("saveData"));
            localStorage.removeItem("saveData");
            navigate("/setup");
          }}
          className="button  continue__button"
        >
          New game
        </button>
        <button
          onClick={() => navigate("/game")}
          className="button button_submit continue__button"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
