import { Link } from "react-router-dom";

export default function Setup() {
  return (
    <div>
      <h1>
        This is the page where you pick categories, difficulty, number of
        rounds, and questions per round.
      </h1>
      <Link to="/game">Click here to start</Link>
    </div>
  );
}
