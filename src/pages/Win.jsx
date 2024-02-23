import { useLocation } from "react-router-dom";

export default function Win() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const winner = params.get("winner");

  let message;

  winner === "none" ? (message = "It's a tie!") : (message = `${winner} win!`);

  return <h1 style={{ fontSize: "2.5rem" }}>{message}</h1>;
}
