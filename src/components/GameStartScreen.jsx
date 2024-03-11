import "./game-start-screen.css";
import { useState } from "react";

const categoryOptions = [
  { id: "music", optionText: "Music" },
  { id: "sport_and_leisure", optionText: "Sports & leisure" },
  { id: "film_and_tv", optionText: "Film & TV" },
  { id: "arts_and_literature", optionText: "Arts & literature" },
  { id: "history", optionText: "History" },
  { id: "society_and_culture", optionText: "Society & culture" },
  { id: "science", optionText: "Science" },
  { id: "geography", optionText: "Geography" },
  { id: "food_and_drink", optionText: "Food & drink" },
  { id: "general_knowledge", optionText: "General knowledge" },
];
export default function GameStartScreen({
  initialCategories,
  handleSubmit,
  buttonText,
}) {
  const [selectedCategoryIDs, setSelectedCategoryIDs] =
    useState(initialCategories);

  function handleClick(id) {
    setSelectedCategoryIDs((prevIds) => {
      const shouldRemove = prevIds.includes(id);
      if (shouldRemove) return prevIds.filter((prevId) => prevId !== id);

      return [...prevIds, id];
    });
  }

  const isSelected = (id) => selectedCategoryIDs.includes(id);

  const categoryOptionElems = categoryOptions.map(({ id, optionText }, idx) => (
    <button
      key={idx}
      onClick={() => handleClick(id)}
      className={
        "game-start-screen__button" +
        (isSelected(id) ? " game-start-screen__button_selected" : "")
      }
    >
      {optionText}
    </button>
  ));

  return (
    <div className="game-start-screen">
      <h1 className="game-start-screen__title">Select categories!</h1>
      <div className="game-start-screen__options-container">
        {categoryOptionElems}
      </div>
      <button
        onClick={() => handleSubmit(selectedCategoryIDs)}
        className="button button_submit game-start-screen__submit"
      >
        {buttonText}
      </button>
    </div>
  );
}
