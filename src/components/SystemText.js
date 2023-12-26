// src/components/SystemText.js
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const SystemText = () => {
  const systemMessages = useSelector((state) => state.game.systemMessages);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [systemMessages]);

  return (
    <div className="SystemText">
      {systemMessages.map((msg, index) => (
        <p key={index}>
          <span className="timestamp">[{msg.timestamp}]</span> {msg.text}
        </p>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default SystemText;
