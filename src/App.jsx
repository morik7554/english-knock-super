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
      <div
        className="app"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: 24,
          }}
        >
          <h1>English Knock</h1>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <button
              onClick={startGame}
              style={{ width: "100%", padding: "14px 16px", fontSize: 18 }}
            >
              Start
            </button>
            <button
              onClick={() => {}}
              style={{ width: "100%", padding: "14px 16px", fontSize: 18 }}
            >
              Ranking
            </button>
            <button
              onClick={() => {}}
              style={{ width: "100%", padding: "14px 16px", fontSize: 18 }}
            >
              Settings
            </button>
          </div>
        </div>
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
