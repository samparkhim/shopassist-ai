const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load mock store data
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

// Track current active flow
let currentFlow = null;

// Intent detection
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
    msg.includes("disappointed")
  ) {
    return "human_escalation";
  }

  if (
    msg.includes("policy") ||
    msg.includes("shipping") ||
    msg.includes("cancel")
  ) {
    return "policy_query";
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

  return "product_query";
}

// Product query handler
function handleProductQuery(message) {
  const msg = message.toLowerCase();

  let product = null;

  if (msg.includes("smartfit") || msg.includes("watch")) {
    product = products.find((p) => p.name.includes("SmartFit"));
  } else if (msg.includes("airflex") || msg.includes("shoes")) {
    product = products.find((p) => p.name.includes("AirFlex"));
  } else if (msg.includes("headphones")) {
    product = products.find((p) => p.name.includes("NoiseCancel"));
  }

  if (!product) {
    return "I couldn't verify that from store data.";
  }

  if (msg.includes("waterproof")) {
    return `${product.name} is ${
      product.waterproof ? "waterproof." : "not waterproof."
    }`;
  }

  if (msg.includes("warranty")) {
    return `${product.name} has ${product.warranty}.`;
  }

  if (msg.includes("compatible")) {
    return `${product.name} compatibility: ${product.compatibility}`;
  }

  if (msg.includes("size")) {
    if (product.sizes.length > 0) {
      return `Available sizes: ${product.sizes.join(", ")}`;
    }
    return "This product has no size variants.";
  }

  return "I couldn't verify that from store data.";
}

// Order response formatter
function buildOrderReply(foundOrder) {
  if (foundOrder.status === "Delivered") {
    return `Your order ${foundOrder.orderId} has been successfully delivered on ${foundOrder.deliveryDate}.`;
  }

  return `Your order ${foundOrder.orderId} is currently ${foundOrder.status} and expected delivery is ${foundOrder.deliveryDate}.`;
}

// Health check
app.get("/", (req, res) => {
  res.send("Commerce AI Agent Backend Running");
});

// Main chat endpoint
app.post("/chat", (req, res) => {
  try {
    const { message } = req.body;
    const intent = detectIntent(message);

    // Highest priority: escalation interrupts any active flow
    if (intent === "human_escalation") {
      currentFlow = null;

      return res.json({
        reply:
          "I understand your concern. I’m escalating this issue to a human support representative."
      });
    }

    // Continue active order tracking flow
    if (currentFlow === "order_tracking") {
      const foundOrder = orders.find((o) =>
        message.includes(o.orderId)
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
    }

    // Continue active return flow
    if (currentFlow === "return_request") {
      const foundOrder = orders.find((o) =>
        message.includes(o.orderId)
      );

      if (!foundOrder) {
        return res.json({
          reply: "Please provide a valid order ID like ORD1001."
        });
      }

      const returns = JSON.parse(fs.readFileSync(returnsPath));

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
    }

    // New order tracking request
    if (intent === "order_tracking") {
      const foundOrder = orders.find((o) =>
        message.includes(o.orderId)
      );

      if (!foundOrder) {
        currentFlow = "order_tracking";

        return res.json({
          reply: "Sure. Please provide your order ID to track your shipment."
        });
      }

      return res.json({
        reply: buildOrderReply(foundOrder)
      });
    }

    // New return request
    if (intent === "return_request") {
      currentFlow = "return_request";

      return res.json({
        reply: "Sure. Please provide your order ID to initiate the return."
      });
    }

    // Policy queries
    if (intent === "policy_query") {
      return res.json({
        reply: `${policies.returns} ${policies.refunds} ${policies.shipping}`
      });
    }

    // Product queries
    return res.json({
      reply: handleProductQuery(message)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Something went wrong."
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});