import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
  // On the home page, I want a brief introduction, instructions, and a link to pick categories and get started
  return (
    <div className="home">
      <h1 className="home__title">Trivia battle!</h1>
      <h2 className="home__subtitle">
        Divide into two teams, pick categories, and battle it out!
      </h2>
      <Link to="/setup">
        <button className="button button_submit">Get started</button>
      </Link>
    </div>
  );
}
