const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/products.json"))
);

const orders = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/orders.json"))
);

const policies = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/policies.json"))
);

const returnsPath = path.join(__dirname, "data/returns.json");

let currentFlow = null;

function detectIntent(message) {
  const msg = message.toLowerCase();

  if (
    msg.includes("human") ||
    msg.includes("agent") ||
    msg.includes("angry") ||
    msg.includes("terrible") ||
    msg.includes("complaint") ||
    msg.includes("frustrated") ||
    msg.includes("bad service") ||
    msg.includes("worst") ||
    msg.includes("hate") ||
    msg.includes("not happy") ||
    msg.includes("upset") ||
    msg.includes("annoyed") ||
    msg.includes("poor experience")||
    msg.includes("disappointed")
  ) {
    return "human_escalation";
  }

  if (
    msg.includes("track") ||
    msg.includes("where is my order")
  ) {
    return "order_tracking";
  }

  if (
    msg.includes("refund") ||
    msg.includes("return my order") ||
    msg.includes("initiate return")
  ) {
    return "return_request";
  }

  if (
    msg.includes("policy") ||
    msg.includes("shipping") ||
    msg.includes("cancel")
  ) {
    return "policy_query";
  }

  return "ai_query";
}

function buildOrderReply(foundOrder) {
  if (foundOrder.status === "Delivered") {
    return `Your order ${foundOrder.orderId} has been successfully delivered on ${foundOrder.deliveryDate}.`;
  }

  return `Your order ${foundOrder.orderId} is currently ${foundOrder.status} and expected delivery is ${foundOrder.deliveryDate}.`;
}

function isOrderId(message) {
  return /^[A-Z]{3}\d{4}$/i.test(message.trim());
}

async function getAIResponse(message) {
  const context = `
You are ShopAssist AI, a professional AI customer support assistant for an e-commerce store.

Available products:
${JSON.stringify(products, null, 2)}

Store policies:
Returns: ${policies.returns}
Refunds: ${policies.refunds}
Shipping: ${policies.shipping}

Instructions:
- Answer naturally and professionally.
- Keep responses short (maximum 2–4 sentences).
- Be concise like a real customer support chatbot.
- Use the provided product and policy data.
- Infer context intelligently.

Examples:
"Can I wear the watch while swimming?" → brief answer using waterproof info.
"Do you deliver quickly?" → mention shipping timeline briefly.
"I changed my mind about my purchase" → explain return eligibility briefly.
- If unsure, recommend human assistance.
`;

  const models = [
    "openai/gpt-oss-20b:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "nousresearch/hermes-3-llama-3.1-8b:free"
  ];

  for (const model of models) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: [
            {
              role: "system",
              content: context
            },
            {
              role: "user",
              content: message
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      return response.data.choices[0].message.content;

    } catch (err) {
      console.log(`Model failed: ${model}`);
    }
  }

  throw new Error("All AI models failed");
}

app.get("/", (req, res) => {
  res.send("Commerce AI Agent Backend Running");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const intent = detectIntent(message);

    // Human escalation always interrupts everything
    if (intent === "human_escalation") {
      currentFlow = null;

      return res.json({
        reply:
          "I understand your concern. I’m escalating this issue to a human support representative."
      });
    }

    // Handle active order tracking flow
    if (currentFlow === "order_tracking") {
      if (isOrderId(message)) {
        const orderId = message.trim().toUpperCase();

        const foundOrder = orders.find(
          (o) => o.orderId === orderId
        );

        if (!foundOrder) {
          return res.json({
            reply: "Please provide a valid order ID like ORD1001."
          });
        }

        currentFlow = null;

        return res.json({
          reply: buildOrderReply(foundOrder)
        });
      } else {
        currentFlow = null;
      }
    }

    // Handle active return flow
    if (currentFlow === "return_request") {
      if (isOrderId(message)) {
        const orderId = message.trim().toUpperCase();

        const foundOrder = orders.find(
          (o) => o.orderId === orderId
        );

        if (!foundOrder) {
          return res.json({
            reply: "Please provide a valid order ID like ORD1001."
          });
        }

        const returns = JSON.parse(
          fs.readFileSync(returnsPath)
        );

        returns.push({
          orderId: foundOrder.orderId,
          timestamp: new Date()
        });

        fs.writeFileSync(
          returnsPath,
          JSON.stringify(returns, null, 2)
        );

        currentFlow = null;

        return res.json({
          reply: `Return request for ${foundOrder.orderId} has been successfully created.`
        });
      } else {
        currentFlow = null;
      }
    }

    // New order tracking
    if (intent === "order_tracking") {
      const foundOrder = orders.find((o) =>
        message.includes(o.orderId)
      );

      if (!foundOrder) {
        currentFlow = "order_tracking";

        return res.json({
          reply:
            "Sure. Please provide your order ID to track your shipment."
        });
      }

      return res.json({
        reply: buildOrderReply(foundOrder)
      });
    }

    // New return
    if (intent === "return_request") {
      currentFlow = "return_request";

      return res.json({
        reply:
          "Sure. Please provide your order ID to initiate the return."
      });
    }

    // Policy
    if (intent === "policy_query") {
      return res.json({
        reply: `${policies.returns} ${policies.refunds} ${policies.shipping}`
      });
    }

    // AI fallback
    const aiReply = await getAIResponse(message);

    return res.json({
      reply: aiReply
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
     reply:
  "I'm having trouble accessing advanced AI support right now, but I can still help with orders, returns, refunds, and policies."
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});