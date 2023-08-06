import React, { useState } from "react";

type Problem = { first: number; second: number; operator: string };
type HistoryEntry = Problem & { answer: number };

function App() {
  const QUESTION_MAX = 20;
  const OPERATORS = {
    plus: "+",
    minus: "-",
    times: "x",
  };

  const [problem, setProblem] = useState<Problem>();
  const [questionAnswered, setQuestionAnswered] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const randomNumberGenerator = (max = 101) => {
    return Math.floor(Math.random() * max);
  };

  const randomOperatorGenerator = () => {
    const MAX = 3;
    const MIN = 0;

    //Max number not included
    const index = Math.floor(Math.random() * (MAX - MIN) + MIN * 10);
    return Object.values(OPERATORS)[index];
  };

  const problemGenerator = () => {
    const x = randomNumberGenerator();
    const operator = randomOperatorGenerator();
    const y =
      operator === OPERATORS.times // prevent multiplication with large multiplier
        ? randomNumberGenerator(11)
        : randomNumberGenerator();

    x > y
      ? setProblem({ first: x, second: y, operator })
      : setProblem({ first: y, second: x, operator });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const answer = parseInt(event.currentTarget.value, 10);

    const first = problem?.first;
    const second = problem?.second;
    const operator = problem?.operator;

    if (first == null || second == null || !operator) return;
    history.push({ first, second, operator, answer });

    event.currentTarget.value = "";

    const questionAnsweredPlusOne = questionAnswered + 1;
    setQuestionAnswered(questionAnsweredPlusOne);
    problemGenerator();
  };

  const calculate = (problem: Problem) => {
    switch (problem.operator) {
      case OPERATORS.plus:
        return problem.first + problem.second;
      case OPERATORS.minus:
        return problem.first - problem.second;
      case OPERATORS.times:
        return problem.first * problem.second;
    }
  };

  return (
    <div className="flex flex-col w-screen h-full min-h-screen py-2 px-4">
      <header className="w-full h-9 flex justify-end">
        Answered {questionAnswered}/{QUESTION_MAX}
      </header>
      <main className="flex flex-col gap-4 items-center justify-center w-full h-full grow">
        {questionAnswered === QUESTION_MAX ? (
          <>
            <div className="w-full md:max-h-[480px] md:grid md:grid-rows-4 md:grid-flow-col">
              {history.map((value, index) => {
                const correctAnswer = calculate(value);
                const isAnswerCorrect = correctAnswer === value.answer;

                return (
                  <div
                    className={`${
                      !isAnswerCorrect && "text-[#bf616a]"
                    } flex flex-col flex-shrink items-center my-2 mx-5 pb-2 border-b border-[#4c566a]`}
                    key={index}
                  >
                    <span className="font-bold text-lg">
                      Question {index + 1}
                    </span>
                    <span className="font-medium">
                      {value.first} {value.operator} {value.second} ={" "}
                      {value.answer}
                    </span>
                    {!isAnswerCorrect && (
                      <span className="text-sm text-center">
                        correct answer: {correctAnswer}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setHistory([]);
                setQuestionAnswered(0);
              }}
              className="border border-[#eceff4] rounded-md p-2 w-full md:w-1/5"
            >
              Restart
            </button>
          </>
        ) : problem ? (
          <>
            <span>Question {questionAnswered + 1}</span>
            <span className="text-6xl font-bold">
              {problem &&
                `${problem.first} ${problem.operator} ${problem.second}`}
            </span>
            <div className="flex flex-col justify-center items-center gap-2">
              <input
                type="number"
                required
                onKeyDown={(event) => handleKeyDown(event)}
                className="min-w-0 flex-auto rounded-md border-0 bg-[#eceff4] px-3.5 py-2 text-[#242933] shadow-sm ring-1 ring-[#d8dee9] focus:ring-1 focus:ring-inset focus:ring-[#88c0d0] sm:text-sm sm:leading-6"
                placeholder="Answer here..."
              />
              <span className="text-sm">press enter to submit</span>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                problemGenerator();
              }}
              className="border border-[#eceff4] rounded-md p-2"
            >
              Generate Problems
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
