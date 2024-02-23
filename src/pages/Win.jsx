import { useLocation, useNavigate } from "react-router-dom";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "200px",
        justifyContent: "space-between",
      }}
    >
      <h1 style={{ fontSize: "2.5rem" }}>
        {winner ? (
          <>
            {winningScore} - {losingScore}
            <br />
            {winner} win!
          </>
        ) : (
          "Its a tie!"
        )}
      </h1>
      <button
        onClick={() => navigate("/setup")}
        className="button button_submit"
      >
        Play again
      </button>
    </div>
  );
}
