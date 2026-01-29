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
          background: "linear-gradient(180deg, #f6f8ff 0%, #e9eefc 100%)",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            padding: 28,
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ fontSize: 32, margin: 0 }}>English Knock</h1>
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
              style={{
                width: "100%",
                padding: "16px 18px",
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                background: "#4a6cf7",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Start
            </button>
            <button
              onClick={() => {}}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 16,
                borderRadius: 10,
                border: "1px solid #d7defa",
                background: "#f6f8ff",
                cursor: "pointer",
              }}
            >
              Ranking
            </button>
            <button
              onClick={() => {}}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 16,
                borderRadius: 10,
                border: "1px solid #d7defa",
                background: "#f6f8ff",
                cursor: "pointer",
              }}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === SCREENS.RESULT) {
    const correctCount = results.filter((r) => r.isCorrect).length;
    return (
      <div
        className="app"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #f6f8ff 0%, #e9eefc 100%)",
          padding: 24,
          color: "#1f2a44",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            padding: 24,
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ margin: 0 }}>Result</h2>
          <div style={{ fontWeight: 600 }}>
            {correctCount} / {results.length}
          </div>
          <div
            className="result-list"
            style={{
              width: "100%",
              maxHeight: 260,
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: 12,
              padding: 12,
              border: "1px solid #e6e9f2",
            }}
          >
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
          <button
            onClick={startGame}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 600,
              color: "#ffffff",
              background: "#4a6cf7",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
          <button
            onClick={() => setScreen(SCREENS.TITLE)}
            style={{
              width: "100%",
              padding: "12px 14px",
              fontSize: 15,
              borderRadius: 10,
              border: "1px solid #d7defa",
              background: "#f6f8ff",
              cursor: "pointer",
            }}
          >
            Back to Title
          </button>
        </div>
      </div>
    );
  }

  return <GameScreen key={gameSession} onFinish={handleFinish} />;
}
