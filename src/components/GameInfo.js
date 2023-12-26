// Inside GameInfo.js
import React from "react";
import { useSelector } from "react-redux";

const GameInfo = () => {
  const time = useSelector((state) => state.game.time);
  const { energy, hunger, thirst } = useSelector(
    (state) => state.game.playerAttributes
  );
  const survivalStatus = useSelector((state) => state.game.survivalStatus);
  const survivedDays = useSelector((state) => state.game.survivedDays);

  return (
    <div className="GameInfo">
      <h3>Game Info</h3>
      <p>Survived Days: {survivedDays}</p>
      <p>Current Time: {time}</p>
      <p>Energy: {energy}</p>
      <p>Hunger: {hunger}</p>
      <p>Thirst: {thirst}</p>
      <p>Status: {survivalStatus}</p>
    </div>
  );
};

export default GameInfo;
