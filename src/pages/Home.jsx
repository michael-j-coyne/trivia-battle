import { Link } from "react-router-dom";

export default function Home() {
  // On the home page, I want a brief introduction, instructions, and a link to pick categories and get started
  return (
    <div>
      <h1>This is the homepage</h1>
      <p>And this is a paragraph on the homepage</p>
      <Link to="/setup">Click here to pick a category and get started</Link>
    </div>
  );
}
