import { useLocation, useNavigate } from "react-router-dom";

export default function Win() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const winner = params.get("winner");

  let message;

  winner === "none" ? (message = "It's a tie!") : (message = `${winner} win!`);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "150px",
        justifyContent: "space-between",
      }}
    >
      <h1 style={{ fontSize: "2.5rem" }}>{message}</h1>
      <button
        style={{ height: "50px", fontSize: "1.25rem" }}
        onClick={() => navigate("/setup")}
        className="button button_submit"
      >
        Play again
      </button>
    </div>
  );
}
