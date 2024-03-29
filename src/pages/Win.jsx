import { useLocation, useNavigate } from "react-router-dom";
import "./win.css";

export default function Win() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const teamOne = params.get("teamone");
  const teamTwo = params.get("teamtwo");
  const teamOneScore = Number(params.get("teamonescore"));
  const teamTwoScore = Number(params.get("teamtwoscore"));

  let winner;
  let winningScore;
  let losingScore;

  if (teamOneScore > teamTwoScore) {
    winner = teamOne;
    winningScore = teamOneScore;
    losingScore = teamTwoScore;
  } else if (teamTwoScore > teamOneScore) {
    winner = teamTwo;
    winningScore = teamTwoScore;
    losingScore = teamOneScore;
  }

  return (
    <div className="win">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "200px",
          justifyContent: "space-between",
        }}
      >
        {winner && (
          <h2 className="game__score">
            {winningScore} - {losingScore}
          </h2>
        )}
        <h1 className="game__winner">
          {winner ? `${winner} win(s)!` : "Its a tie!"}
        </h1>
        <button
          onClick={() => navigate("/setup")}
          className="button button_submit"
        >
          Play again
        </button>
      </div>
    </div>
  );
}
