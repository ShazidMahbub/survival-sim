import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeZone } from "../store/gameSlice";
import "./GameZone.css";

const GameZone = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 150, y: 150 }); // Center of the canvas

  // This function will return the name of the zone based on the clicked coordinates.
  const getClickedZone = (
    clickX,
    clickY,
    centerX,
    centerY,
    gameZoneRadius,
    safeZoneRadius
  ) => {
    const dx = clickX - centerX;
    const dy = clickY - centerY;
    let angle = Math.atan2(dy, dx);
    // Adjust angle to start from the top (12 o'clock)
    angle = angle < -Math.PI / 2 ? angle + 2.5 * Math.PI : angle + Math.PI / 2;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if within safe zone
    if (distance <= safeZoneRadius) {
      return "safe-zone";
    }

    // Angles for each zone
    const angles = {
      forest: { start: 0, end: (2 * Math.PI) / 3 },
      river: { start: (2 * Math.PI) / 3, end: (4 * Math.PI) / 3 },
      mountain: { start: (4 * Math.PI) / 3, end: 2 * Math.PI },
    };

    // Check which zone is clicked based on the angle
    for (const [zone, { start, end }] of Object.entries(angles)) {
      if (angle >= start && angle < end && distance <= gameZoneRadius) {
        return zone;
      }
    }

    return null; // If not within any zone
  };

  // Function to draw the game zones on the canvas
  const drawGameZones = (ctx) => {
    // Constants for game zone dimensions
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const safeZoneRadius = 50; // Radius of the safe zone
    const gameZoneRadius = width / 2; // Radius of the game zone

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Function to draw a zone sector
    const drawSector = (startAngle, endAngle, color) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        gameZoneRadius,
        startAngle - Math.PI / 2,
        endAngle - Math.PI / 2,
        false
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    // Draw the game zones
    drawSector(0, (2 * Math.PI) / 3, "green"); // Forest
    drawSector((2 * Math.PI) / 3, (4 * Math.PI) / 3, "blue"); // River
    drawSector((4 * Math.PI) / 3, 2 * Math.PI, "grey"); // Mountain

    // Draw the safe zone
    ctx.beginPath();
    ctx.arc(centerX, centerY, safeZoneRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "orange";
    ctx.fill();

    // Draw the player
    ctx.fillStyle = "black";
    ctx.fillRect(playerPosition.x - 10, playerPosition.y - 10, 20, 20); // Player is a 20x20 square
  };

  // Function to handle canvas click events
  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const gameZoneRadius = rect.width / 2;
    const safeZoneRadius = 50;

    // Get the clicked zone
    const clickedZone = getClickedZone(
      clickX,
      clickY,
      centerX,
      centerY,
      gameZoneRadius,
      safeZoneRadius
    );

    // Update the player's position based on the clicked zone
    const zonePositions = {
      forest: {
        x: centerX + 0.5 * centerX,
        y: centerY - 0.25 * centerY,
      },
      river: {
        x: centerX,
        y: centerY + 0.5 * centerY,
      },
      mountain: {
        x: centerX - 0.5 * centerX,
        y: centerY - 0.25 * centerY,
      },
      "safe-zone": {
        x: centerX,
        y: centerY,
      },
    };

    if (clickedZone) {
      setPlayerPosition(zonePositions[clickedZone]);
      dispatch(changeZone({ zone: clickedZone }));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    drawGameZones(context);
  }, [playerPosition]);

  return (
    <canvas
      ref={canvasRef}
      width="300"
      height="300"
      onClick={handleCanvasClick}
      className="game-zone-canvas"
    />
  );
};

export default GameZone;
