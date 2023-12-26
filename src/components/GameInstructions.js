// src/components/GameInstructions.js
import React from "react";

const GameInstructions = () => {
  return (
    <div className="GameInstructions">
      <h2>Game Instructions</h2>
      <p>Welcome to the survival game! Here's how to play:</p>
      <ul>
        <li>
          Explore different zones: forest, river, mountain, and safe zone by
          clicking them.
        </li>
        <li>
          Forest zone is is greej, river zone is blue, mountain zone is gray,
          and safe zone is orange
        </li>
        <li>Each zone has unique challenges and opportunities.</li>
        <li>Manage your energy, hunger, and thirst to survive.</li>
        <li>Random events will occur based on your actions and time of day.</li>
        <li>Survive as many days as you can!</li>
        <li>Be cautious: poor decisions can lead to your demise.</li>
        <li>
          When your energy reaches 0, hunger, or thirst reaches 100, it's game
          over.
        </li>
      </ul>
      <p>Good luck and enjoy the adventure!</p>
    </div>
  );
};

export default GameInstructions;
