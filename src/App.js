// src/App.js
import React from "react";
import GameZone from "./components/GameZone";
import GameInfo from "./components/GameInfo";
import SystemText from "./components/SystemText";
import GameInstructions from "./components/GameInstructions";
import { useSelector } from "react-redux";
import "./App.css";

function App() {
  const survivalStatus = useSelector((state) => state.game.survivalStatus);

  return (
    <div className="App">
      <main>
        <div className="instructions-container">
          <GameInstructions />
        </div>
        <div className="content">
          <GameInfo />
          <SystemText />
          {survivalStatus === "alive" ? (
            <GameZone />
          ) : (
            <div className="GameOver">Game Over. Refresh to play again.</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
