import "./trivia.css";

// question: String
// options: Array[String]
export default function Trivia({ question, choices }) {
  const optionElems = choices.map((choice, idx) => (
    <button className="trivia__choice" key={idx}>
      {choice}
    </button>
  ));

  return (
    <div className="trivia">
      <h1 className="trivia__title">{question}</h1>
      <div className="trivia__choice-container">{optionElems}</div>
    </div>
  );
}
