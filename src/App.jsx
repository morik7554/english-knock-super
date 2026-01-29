import { useState } from "react";
import GameScreen from "./components/GameScreen";

const SCREENS = {
  TITLE: "TITLE",
  GAME: "GAME",
  RESULT: "RESULT",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.TITLE);
  const [gameSession, setGameSession] = useState(0);
  const [results, setResults] = useState([]);

  const startGame = () => {
    setGameSession((s) => s + 1);
    setScreen(SCREENS.GAME);
  };

  const handleFinish = ({ results: nextResults } = {}) => {
    if (nextResults) setResults(nextResults);
    setScreen(SCREENS.RESULT);
  };

  if (screen === SCREENS.TITLE) {
    return (
      <div className="app">
        <h1>English Knock</h1>
        <button onClick={startGame}>Start</button>
      </div>
    );
  }

  if (screen === SCREENS.RESULT) {
    return (
      <div className="app">
        <h2>Result</h2>
        <div className="result-list">
          {results.map((r, i) => (
            <div key={i} className="result-item">
              {r.isCorrect ? (
                <div>⭕️ {r.user}</div>
              ) : (
                <>
                  <div>❌ {r.user}</div>
                  <div>
                    <strong>{r.correct}</strong>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <button onClick={startGame}>Retry</button>
        <button onClick={() => setScreen(SCREENS.TITLE)}>Back to Title</button>
      </div>
    );
  }

  return <GameScreen key={gameSession} onFinish={handleFinish} />;
}
