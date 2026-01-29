import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "../data/questions";

export default function GameScreen({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState({ ...QUESTIONS[0] });
  const [choices, setChoices] = useState([]);
  const [userWords, setUserWords] = useState([]);
  const [result, setResult] = useState(null);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const resultsRef = useRef(results);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    const id = setTimeout(() => {
      onFinish?.({ type: "timeup", results: resultsRef.current });
    }, 45000);
    return () => clearTimeout(id);
  }, [onFinish]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const words = question.en.split(" ").filter(Boolean);
    const shuffled = [...words]
      .map((w, i) => ({ text: w, id: i, hidden: false }))
      .sort(() => Math.random() - 0.5);
    setChoices(shuffled);
    setUserWords([]);
    setResult(null);
  }, [question]);

  const onTapChoice = (i) => {
    const target = choices[i];
    if (!target || target.hidden) return;

    setChoices((prev) =>
      prev.map((w, idx) => (idx === i ? { ...w, hidden: true } : w))
    );
    setUserWords((prev) => [...prev, target]);
  };

  const onTapUserWord = (i) => {
    const removed = userWords[i];
    if (!removed) return;

    setUserWords((prev) => prev.filter((_, idx) => idx !== i));
    setChoices((prev) =>
      prev.map((w) => (w.id === removed.id ? { ...w, hidden: false } : w))
    );
  };

  const nextQuestion = () => {
    const next = (index + 1) % QUESTIONS.length;
    setIndex(next);
    setQuestion({ ...QUESTIONS[next] });
  };

  useEffect(() => {
    if (choices.length === 0) return;
    const allUsed = choices.every((w) => w.hidden);
    if (!allUsed) return;
    if (result !== null) return;

    const userAnswer = userWords.map((w) => w.text).join(" ");
    const isCorrect = userAnswer === question.en;
    const nextResults = [
      ...results,
      {
        jp: question.jp ?? question.ja,
        correct: question.en,
        user: userAnswer,
        isCorrect,
      },
    ];
    setResults(nextResults);

    if (isCorrect) {
      setResult("correct");
      setTimeout(nextQuestion, 800);
    } else {
      setResult("wrong");
      setTimeout(nextQuestion, 800);
    }
  }, [userWords, choices, question, onFinish, results, result]);

  return (
    <div className="app bg">
      <div className="game-layout">
        <div>残り：{timeLeft}秒</div>
        <div className="card question">{question.ja}</div>

        <div className="card answer">
          {userWords.length === 0 && (
            <span className="hint">ここに英文を作ろう</span>
          )}

          {userWords.map((w, i) => (
            <button
              key={i}
              className="word selected"
              onClick={() => onTapUserWord(i)}
            >
              {w.text}
            </button>
          ))}

          {result === "correct" && <div className="result ok">○</div>}
          {result === "wrong" && <div className="result ng">×</div>}
        </div>

        <div className="card choices">
          {choices.map((w, i) =>
            w.hidden ? null : (
              <button key={i} className="word" onClick={() => onTapChoice(i)}>
                {w.text}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
