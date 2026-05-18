import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI Commerce Support Agent. Ask about orders, refunds, products, or policies."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customMessage = null) => {
    const msgToSend = customMessage || message;

    if (!msgToSend.trim()) return;

    const userMessage = {
      sender: "user",
      text: msgToSend
    };

    setChat((prev) => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msgToSend })
    });

    const data = await response.json();

    setLoading(false);

    const botMessage = {
      sender: "bot",
      text: data.reply
    };

    setChat((prev) => [...prev, botMessage]);
  };

  return (
    <div className="app">
      <div className="background-glow"></div>

      <div className="chat-container">
        <div className="header">
          <div>
            <h1>⚡ ShopAssist AI</h1>
            <p>AI-powered customer support for modern commerce</p>
          </div>
          <div className="status">● Online</div>
        </div>

        <div className="quick-actions">
          <button onClick={() => sendMessage("where is my order?")}>
            📦 Track Order
          </button>

          <button onClick={() => sendMessage("I want refund")}>
            ↩ Return Product
          </button>

          <button onClick={() => sendMessage("What is your return policy?")}>
            📜 Return Policy
          </button>

          <button onClick={() => sendMessage("I want to talk to a human agent")}>
            👨‍💼 Talk to Human
          </button>
        </div>

        <div className="chat-box">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "message user-message"
                  : "message bot-message"
              }
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="message bot-message">
              AI is thinking...
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;