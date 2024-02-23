import "./continue.css";

export default function Continue() {
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
        <button className="button  continue__button">New game</button>
        <button className="button button_submit continue__button">
          Continue
        </button>
      </div>
    </div>
  );
}
