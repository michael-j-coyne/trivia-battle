const randomizeArr = (arr) => arr.toSorted(() => 0.5 - Math.random());

// amount: int
// categories: String - ex: "general_knowledge,history"
// difficulties: String - ex: "easy,medium,hard"
export default async function fetchTrivia({
  amount,
  categories,
  difficulties,
}) {
  let res = await fetch(
    `https://the-trivia-api.com/v2/questions?categories=${categories}&limit=${amount}&difficulties=${difficulties}`
  );

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  let dataArray = await res.json();

  return dataArray.map((obj) => ({
    id: obj.id,
    category: obj.category,
    question: obj.question.text,
    correctAnswer: obj.correctAnswer,
    choices: randomizeArr([...obj.incorrectAnswers, obj.correctAnswer]),
  }));
}
