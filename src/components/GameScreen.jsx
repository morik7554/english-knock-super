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
  const [countdown, setCountdown] = useState(3);
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
    if (countdown === null) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c === null) return c;
        if (c <= 1) return null;
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

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
    if (countdown !== null) return;
    const target = choices[i];
    if (!target || target.hidden) return;

    setChoices((prev) =>
      prev.map((w, idx) => (idx === i ? { ...w, hidden: true } : w))
    );
    setUserWords((prev) => [...prev, target]);
  };

  const onTapUserWord = (i) => {
    if (countdown !== null) return;
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
      {countdown !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            zIndex: 999,
            fontSize: 120,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          {countdown}
        </div>
      )}
      <div
        className="game-layout"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 16,
          padding: 24,
        }}
      >
        <div>残り：{timeLeft}秒</div>

        <div
          className="card question"
          style={{
            width: "100%",
            maxWidth: 560,
            background: "#f2f4f8",
            borderRadius: 12,
            padding: 16,
          }}
        >
          {question.jp ?? question.ja}
        </div>

        <div
          className="card answer"
          style={{
            width: "100%",
            maxWidth: 560,
            background: "#ffffff",
            borderRadius: 14,
            padding: 20,
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            border: "1px solid #e6e9f2",
          }}
        >
          {userWords.length === 0 && (
            <span className="hint">ここに英文を作ろう</span>
          )}

          {userWords.map((w, i) => (
            <button
              key={i}
              className="word selected"
              onClick={() => onTapUserWord(i)}
              disabled={countdown !== null}
            >
              {w.text}
            </button>
          ))}

          {result === "correct" && <div className="result ok">○</div>}
          {result === "wrong" && <div className="result ng">×</div>}
        </div>

        <div
          className="card choices"
          style={{
            width: "100%",
            maxWidth: 560,
            background: "#f7f8fc",
            borderRadius: 12,
            padding: 16,
            border: "1px dashed #d7defa",
          }}
        >
          {choices.map((w, i) => (
            <button
              key={i}
              className="word"
              onClick={() => onTapChoice(i)}
              disabled={countdown !== null || w.hidden}
              style={w.hidden ? { visibility: "hidden" } : undefined}
            >
              {w.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
